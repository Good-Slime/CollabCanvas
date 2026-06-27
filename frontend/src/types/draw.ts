export interface DrawData {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  lineWidth: number;
}

export interface User {
  socketId: string;
  username: string;
  color: string;
  x?: number;
  y?: number;
}
