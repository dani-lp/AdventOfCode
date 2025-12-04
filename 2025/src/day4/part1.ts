import { assertResult, printGrid, readInput } from "../utils";

type Point = {
  x: number;
  y: number;
};

const EMPTY_SYMBOL = ".";
const PAPER_ROLL_SYMBOL = "@";

const input = readInput({ test: false, split: true, clear: true });
const gridWidth = input[0].length + 2;

const grid = [
  Array.from({ length: gridWidth }, () => EMPTY_SYMBOL),
  ...input.map((row) =>
    [EMPTY_SYMBOL].concat(row.split("")).concat([EMPTY_SYMBOL])
  ),
  Array.from({ length: gridWidth }, () => EMPTY_SYMBOL),
];

let validPoints: Point[] = [];
for (let y = 1; y < grid.length - 1; y++) {
  for (let x = 1; x < grid[y].length - 1; x++) {
    if (grid[y][x] !== PAPER_ROLL_SYMBOL) {
      continue;
    }
    const points = [
      { x: x + 1, y: y },
      { x: x - 1, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y - 1 },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
    ]
      .map(({ x, y }) => grid[y][x])
      .filter((symbol) => symbol === PAPER_ROLL_SYMBOL);

    if (points.length < 4) {
      validPoints.push({ x, y });
    }
  }
}

assertResult(13, validPoints.length);
