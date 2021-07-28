import * as fs from "fs";
import * as path from "path";
import { createGif } from "..";
import * as grids from "@snk/compute/__fixtures__/grid";
import { snake3 as snake } from "@snk/compute/__fixtures__/snake";
import { createSnake, nextSnake } from "@snk/compute/snake";
import { getBestRoute } from "@snk/compute/getBestRoute";

jest.setTimeout(20 * 1000);

const drawOptions = {
  sizeBorderRadius: 2,
  sizeCell: 16,
  sizeDot: 12,
  colorBorder: "#1b1f230a",
  colorDots: { 1: "#9be9a8", 2: "#40c463", 3: "#30a14e", 4: "#216e39" },
  colorEmpty: "#ebedf0",
  colorSnake: "purple",
};

const gifOptions = { frameDuration: 200, step: 1 };

const dir = path.resolve(__dirname, "__snapshots__");

try {
  fs.mkdirSync(dir);
} catch (err) {}

for (const key of [
  "empty",
  "simple",
  "corner",
  "small",
  "smallPacked",
  "enclave",
] as const)
  it(`should generate ${key} gif`, async () => {
    const grid = grids[key];

    const chain = [snake, ...getBestRoute(grid, snake)!];

    const gif = await createGif(grid, chain, drawOptions, gifOptions);

    expect(gif).toBeDefined();

    fs.writeFileSync(path.resolve(dir, key + ".gif"), gif);
  });

it(`should generate swipper`, async () => {
  const grid = grids.smallFull;
  let snk = createSnake(Array.from({ length: 6 }, (_, i) => ({ x: i, y: -1 })));

  const chain = [snk];
  for (let y = -1; y < grid.height; y++) {
    snk = nextSnake(snk, 0, 1);
    chain.push(snk);

    for (let x = grid.width - 1; x--; ) {
      snk = nextSnake(snk, (y + 100) % 2 ? 1 : -1, 0);
      chain.push(snk);
    }
  }

  const gif = await createGif(grid, chain, drawOptions, gifOptions);

  expect(gif).toBeDefined();

  fs.writeFileSync(path.resolve(dir, "swipper.gif"), gif);
});
