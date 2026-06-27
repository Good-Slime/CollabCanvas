import type { DrawData } from "../types/draw";

export function drawLine(
    ctx: CanvasRenderingContext2D,
    data: DrawData
){
    ctx.beginPath();

    ctx.moveTo(data.x0,data.y0);

    ctx.lineTo(data.x1,data.y1);

    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    ctx.stroke();
}
