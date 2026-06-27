import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/whiteboard",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

