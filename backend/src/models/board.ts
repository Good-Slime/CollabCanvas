import { Schema, model, Document } from "mongoose";

export interface IStroke {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  lineWidth: number;
}

export interface IBoard extends Document {
  roomId: string;
  strokes: IStroke[];
  updatedAt: Date;
}

const strokeSchema = new Schema<IStroke>({
  x0: { type: Number, required: true },
  y0: { type: Number, required: true },
  x1: { type: Number, required: true },
  y1: { type: Number, required: true },
  color: { type: String, required: true },
  lineWidth: { type: Number, required: true },
});

const boardSchema = new Schema<IBoard>({
  roomId: { type: String, required: true, unique: true },
  strokes: { type: [strokeSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export const Board = model<IBoard>("Board", boardSchema);
