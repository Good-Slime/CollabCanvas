import React, { useEffect, useRef, useState } from "react";
import { socket } from "../sockets/sockets";
import type { DrawData, User } from "../types/draw";
import Cursors from "./Cursors";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";

interface CanvasProps {
  roomId: string;
  username: string;
  onLeaveRoom: () => void;
}

function Canvas({ roomId, username, onLeaveRoom }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<DrawData[]>([]);
  const isDrawing = useRef(false);
  const prevX = useRef(0);
  const prevY = useRef(0);
  const lastCursorEmit = useRef(0);
  const notificationTimeout = useRef<number | null>(null);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [notification, setNotification] = useState("");

  const showNotification = (message: string) => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    setNotification(message);
    notificationTimeout.current = window.setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const drawAllStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    strokesRef.current.forEach((stroke) => {
      ctx.beginPath();
      ctx.moveTo(stroke.x0 * canvas.width, stroke.y0 * canvas.height);
      ctx.lineTo(stroke.x1 * canvas.width, stroke.y1 * canvas.height);
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    });
  };

  const drawRemoteStroke = (stroke: DrawData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(stroke.x0 * canvas.width, stroke.y0 * canvas.height);
    ctx.lineTo(stroke.x1 * canvas.width, stroke.y1 * canvas.height);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  useEffect(() => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    socket.emit("join-room", { roomId, username, color: randomColor });

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleBoardState = (strokes: DrawData[]) => {
      strokesRef.current = strokes;
      drawAllStrokes();
    };

    const handleDraw = (stroke: DrawData) => {
      strokesRef.current.push(stroke);
      drawRemoteStroke(stroke);
    };

    const handleClear = () => {
      strokesRef.current = [];
      drawAllStrokes();
    };

    const handleRoomUsers = (usersList: User[]) => {
      setActiveUsers(usersList);
    };

    const handleUserJoined = (newUser: User) => {
      setActiveUsers((prev) => [
        ...prev.filter((u) => u.socketId !== newUser.socketId),
        newUser,
      ]);
      showNotification(`${newUser.username} joined the room`);
    };

    const handleUserLeft = (socketId: string) => {
      setActiveUsers((prev) => {
        const leftUser = prev.find((u) => u.socketId === socketId);
        if (leftUser) {
          showNotification(`${leftUser.username} left the room`);
        }
        return prev.filter((u) => u.socketId !== socketId);
      });
    };

    const handleCursorMove = ({ socketId, x, y }: { socketId: string; x: number; y: number }) => {
      setActiveUsers((prev) =>
        prev.map((u) => (u.socketId === socketId ? { ...u, x, y } : u))
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("board-state", handleBoardState);
    socket.on("draw", handleDraw);
    socket.on("clear-board", handleClear);
    socket.on("room-users", handleRoomUsers);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("cursor-move", handleCursorMove);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("board-state", handleBoardState);
      socket.off("draw", handleDraw);
      socket.off("clear-board", handleClear);
      socket.off("room-users", handleRoomUsers);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("cursor-move", handleCursorMove);
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
    };
  }, [roomId, username]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawAllStrokes();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    prevX.current = e.nativeEvent.offsetX;
    prevY.current = e.nativeEvent.offsetY;
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDrawing.current) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const currX = e.nativeEvent.offsetX;
        const currY = e.nativeEvent.offsetY;
        const drawColor = tool === "eraser" ? "#ffffff" : color;

        ctx.beginPath();
        ctx.moveTo(prevX.current, prevY.current);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        const strokeData: DrawData = {
          x0: prevX.current / canvas.width,
          y0: prevY.current / canvas.height,
          x1: currX / canvas.width,
          y1: currY / canvas.height,
          color: drawColor,
          lineWidth,
        };

        strokesRef.current.push(strokeData);

        socket.emit("draw", {
          roomId,
          drawData: strokeData,
        });

        prevX.current = currX;
        prevY.current = currY;
      }
    }

    const now = Date.now();
    if (now - lastCursorEmit.current > 35) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      socket.emit("cursor-move", { roomId, x, y });
      lastCursorEmit.current = now;
    }
  };

  const handleClearBoard = () => {
    socket.emit("clear-board", roomId);
  };

  const handleUndo = () => {
    socket.emit("undo", roomId);
  };

  const handleRedo = () => {
    socket.emit("redo", roomId);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `whiteboard-${roomId}.png`;
      link.click();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white select-none">
      <Navbar
        roomId={roomId}
        isConnected={isConnected}
        activeUsersCount={activeUsers.length + 1}
        onLeaveRoom={onLeaveRoom}
      />

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={handleMouseMove}
        onMouseLeave={stopDrawing}
        className="absolute inset-0 cursor-crosshair block"
      />

      <Cursors users={activeUsers} />

      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        onClear={handleClearBoard}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownload={handleDownload}
      />

      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 px-4 py-2 rounded-xl shadow-lg text-white text-xs font-semibold animate-bounce">
          {notification}
        </div>
      )}
    </div>
  );
}

export default Canvas;
