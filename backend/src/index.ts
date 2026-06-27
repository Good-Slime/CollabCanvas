import cors from "cors";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { Board, IStroke } from "./models/board";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let isMongoConnected = false;
const inMemoryBoards: Record<string, { strokes: IStroke[] }> = {};
const undoneStrokesMap: Record<string, IStroke[]> = {};
const users: Record<string, { roomId: string; username: string; color: string }> = {};

mongoose.connect("mongodb://127.0.0.1:27017/whiteboard")
  .then(() => {
    isMongoConnected = true;
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.warn("MongoDB connection failed, falling back to in-memory store:", err.message);
  });

io.on("connection", (socket) => {
  socket.on("join-room", async ({ roomId, username, color }: { roomId: string; username: string; color: string }) => {
    socket.join(roomId);
    users[socket.id] = { roomId, username, color };

    let strokes: IStroke[] = [];
    if (isMongoConnected) {
      try {
        let board = await Board.findOne({ roomId });
        if (!board) {
          board = await Board.create({ roomId, strokes: [] });
        }
        strokes = board.strokes;
      } catch (err) {
        if (!inMemoryBoards[roomId]) {
          inMemoryBoards[roomId] = { strokes: [] };
        }
        strokes = inMemoryBoards[roomId].strokes;
      }
    } else {
      if (!inMemoryBoards[roomId]) {
        inMemoryBoards[roomId] = { strokes: [] };
      }
      strokes = inMemoryBoards[roomId].strokes;
    }

    socket.emit("board-state", strokes);

    const roomUsers = Object.entries(users)
      .filter(([id, u]) => u.roomId === roomId && id !== socket.id)
      .map(([id, u]) => ({ socketId: id, username: u.username, color: u.color }));
    socket.emit("room-users", roomUsers);

    socket.to(roomId).emit("user-joined", { socketId: socket.id, username, color });
  });

  socket.on("draw", async ({ roomId, drawData }: { roomId: string; drawData: IStroke }) => {
    if (isMongoConnected) {
      try {
        await Board.updateOne(
          { roomId },
          { $push: { strokes: drawData }, $set: { updatedAt: new Date() } }
        );
      } catch (err) {
        if (inMemoryBoards[roomId]) {
          inMemoryBoards[roomId].strokes.push(drawData);
        }
      }
    } else {
      if (inMemoryBoards[roomId]) {
        inMemoryBoards[roomId].strokes.push(drawData);
      }
    }

    if (undoneStrokesMap[roomId]) {
      undoneStrokesMap[roomId] = [];
    }

    socket.to(roomId).emit("draw", drawData);
  });

  socket.on("cursor-move", ({ roomId, x, y }: { roomId: string; x: number; y: number }) => {
    socket.to(roomId).emit("cursor-move", { socketId: socket.id, x, y });
  });

  socket.on("clear-board", async (roomId: string) => {
    if (isMongoConnected) {
      try {
        await Board.updateOne(
          { roomId },
          { $set: { strokes: [], updatedAt: new Date() } }
        );
      } catch (err) {
        if (inMemoryBoards[roomId]) {
          inMemoryBoards[roomId].strokes = [];
        }
      }
    } else {
      if (inMemoryBoards[roomId]) {
        inMemoryBoards[roomId].strokes = [];
      }
    }

    undoneStrokesMap[roomId] = [];
    io.to(roomId).emit("clear-board");
  });

  socket.on("undo", async (roomId: string) => {
    let currentStrokes: IStroke[] = [];
    if (isMongoConnected) {
      try {
        const board = await Board.findOne({ roomId });
        if (board && board.strokes.length > 0) {
          const popped = board.strokes.pop();
          if (popped) {
            if (!undoneStrokesMap[roomId]) {
              undoneStrokesMap[roomId] = [];
            }
            undoneStrokesMap[roomId].push(popped);
          }
          await board.save();
          currentStrokes = board.strokes;
        }
      } catch (err) {
        const b = inMemoryBoards[roomId];
        if (b && b.strokes.length > 0) {
          const popped = b.strokes.pop();
          if (popped) {
            if (!undoneStrokesMap[roomId]) {
              undoneStrokesMap[roomId] = [];
            }
            undoneStrokesMap[roomId].push(popped);
          }
          currentStrokes = b.strokes;
        }
      }
    } else {
      const b = inMemoryBoards[roomId];
      if (b && b.strokes.length > 0) {
        const popped = b.strokes.pop();
        if (popped) {
          if (!undoneStrokesMap[roomId]) {
            undoneStrokesMap[roomId] = [];
          }
          undoneStrokesMap[roomId].push(popped);
        }
        currentStrokes = b.strokes;
      }
    }

    io.to(roomId).emit("board-state", currentStrokes);
  });

  socket.on("redo", async (roomId: string) => {
    const undoneList = undoneStrokesMap[roomId];
    if (undoneList && undoneList.length > 0) {
      const restored = undoneList.pop();
      if (restored) {
        let currentStrokes: IStroke[] = [];
        if (isMongoConnected) {
          try {
            const board = await Board.findOne({ roomId });
            if (board) {
              board.strokes.push(restored);
              await board.save();
              currentStrokes = board.strokes;
            }
          } catch (err) {
            const b = inMemoryBoards[roomId];
            if (b) {
              b.strokes.push(restored);
              currentStrokes = b.strokes;
            }
          }
        } else {
          const b = inMemoryBoards[roomId];
          if (b) {
            b.strokes.push(restored);
            currentStrokes = b.strokes;
          }
        }

        io.to(roomId).emit("board-state", currentStrokes);
      }
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];
      socket.to(user.roomId).emit("user-left", socket.id);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
