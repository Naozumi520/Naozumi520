import { Grid, Color } from "@snk/compute/grid";
import { drawGrid } from "./drawGrid";
import { Snake } from "@snk/compute/snake";
import { drawSnake, drawSnakeLerp } from "./drawSnake";

export type Options = {
  colorDots: Record<Color, string>;
  colorEmpty: string;
  colorBorder: string;
  colorSnake: string;
  sizeCell: number;
  sizeDot: number;
  sizeBorderRadius: number;
};

export const drawStack = (
  ctx: CanvasRenderingContext2D,
  stack: Color[],
  max: number,
  width: number,
  o: { colorDots: Record<Color, string> }
) => {
  ctx.save();

  const m = width / max;

  for (let i = 0; i < stack.length; i++) {
    // @ts-ignore
    ctx.fillStyle = o.colorDots[stack[i]];
    ctx.fillRect(i * m, 0, m + width * 0.005, 10);
  }
  ctx.restore();
};

export const drawWorld = (
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  snake: Snake,
  stack: Color[],
  o: Options
) => {
  ctx.save();

  ctx.translate(1 * o.sizeCell, 2 * o.sizeCell);
  drawGrid(ctx, grid, o);
  drawSnake(ctx, snake, o);

  ctx.restore();

  ctx.save();

  ctx.translate(o.sizeCell, (grid.height + 4) * o.sizeCell);

  const max = grid.data.reduce((sum, x) => sum + +!!x, stack.length);
  drawStack(ctx, stack, max, grid.width * o.sizeCell, o);

  ctx.restore();

  // ctx.save();
  // ctx.translate(o.sizeCell + 100, (grid.height + 4) * o.sizeCell + 100);
  // ctx.scale(0.6, 0.6);
  // drawCircleStack(ctx, stack, o);
  // ctx.restore();
};

export const drawLerpWorld = (
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  snake0: Snake,
  snake1: Snake,
  stack: Color[],
  k: number,
  o: Options
) => {
  ctx.save();

  ctx.translate(1 * o.sizeCell, 2 * o.sizeCell);
  drawGrid(ctx, grid, o);
  drawSnakeLerp(ctx, snake0, snake1, k, o);

  ctx.translate(0, (grid.height + 2) * o.sizeCell);

  const max = grid.data.reduce((sum, x) => sum + +!!x, stack.length);
  drawStack(ctx, stack, max, grid.width * o.sizeCell, o);

  ctx.restore();
};
