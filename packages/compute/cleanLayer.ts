import { copyGrid, isEmpty, setColorEmpty } from "./grid";
import { getHeadX, getHeadY, snakeEquals } from "./snake";
import { sortPush } from "./utils/sortPush";
import { arrayEquals } from "./utils/array";
import { getAvailableRoutes } from "./getAvailableRoutes";
import type { Snake } from "./snake";
import type { Grid } from "./grid";
import type { Point } from "./point";

type M = {
  snake: Snake;
  chain: Snake[];
  chunk: Point[];
  grid: Grid;
  parent: M | null;
  w: number;
  h: number;
  f: number;
};
const unwrap = (o: M | null): Snake[] =>
  !o ? [] : [...o.chain, ...unwrap(o.parent)];

const createGetHeuristic = (grid: Grid, chunk0: Point[]) => {
  const n = grid.data.reduce((sum, x: any) => sum + +!isEmpty(x), 0);
  const area = grid.width * grid.height;

  const k =
    Math.sqrt((2 * area) / chunk0.length) * 1 + (n - chunk0.length) / area;

  return (chunk: any[]) => chunk.length * k;
};

export const getAvailableWhiteListedRoutes = (
  grid: Grid,
  snake: Snake,
  whiteList: Point[]
) => {
  let solution: Snake[] | null;

  getAvailableRoutes(grid, snake, (chain) => {
    const hx = getHeadX(chain[0]);
    const hy = getHeadY(chain[0]);

    if (!whiteList.some(({ x, y }) => hx === x && hy === y)) return false;

    solution = chain;

    return true;
  });

  // @ts-ignore
  return solution;
};

export const cleanLayer = (grid0: Grid, snake0: Snake, chunk0: Point[]) => {
  const getH = createGetHeuristic(grid0, chunk0);

  const next = {
    grid: grid0,
    snake: snake0,
    chain: [snake0],
    chunk: chunk0,
    parent: null,
    h: getH(chunk0),
    f: getH(chunk0),
    w: 0,
  };

  const openList: M[] = [next];
  const closeList: M[] = [next];

  while (openList.length) {
    const o = openList.shift()!;

    if (o.chunk.length === 0) return unwrap(o).slice(0, -1);

    const chain = getAvailableWhiteListedRoutes(o.grid, o.snake, o.chunk);

    if (chain) {
      const snake = chain[0];
      const x = getHeadX(snake);
      const y = getHeadY(snake);

      const chunk = o.chunk.filter((u) => u.x !== x || u.y !== y);

      if (
        !closeList.some(
          (u) => snakeEquals(u.snake, snake) && arrayEquals(u.chunk, chunk)
        )
      ) {
        const grid = copyGrid(o.grid);
        setColorEmpty(grid, x, y);

        const h = getH(chunk);
        const w = o.w + chain.length;
        const f = h + w;

        const next = { snake, chain, chunk, grid, parent: o, h, w, f };
        sortPush(openList, next, (a, b) => a.f - b.f);
        closeList.push(next);
      }
    }
  }
};

// export const getAvailableWhiteListedRoutes = (
//   grid: Grid,
//   snake: Snake,
//   whiteList0: Point[],
//   n = 3
// ) => {
//   const whiteList = whiteList0.slice();
//   const solutions: Snake[][] = [];

//   getAvailableRoutes(grid, snake, (chain) => {
//     const hx = getHeadX(chain[0]);
//     const hy = getHeadY(chain[0]);

//     const i = whiteList.findIndex(({ x, y }) => hx === x && hy === y);

//     if (i >= 0) {
//       whiteList.splice(i, 1);
//       solutions.push(chain);

//       if (solutions.length >= n || whiteList.length === 0) return true;
//     }

//     return false;
//   });

//   return solutions;
// };
