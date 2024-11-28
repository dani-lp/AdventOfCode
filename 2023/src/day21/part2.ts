// Today was too hard for me. I was able to implement the solution
// thanks to this video: https://www.youtube.com/watch?v=9UOMZSL0JTg

import { readInput } from "../utils";

type Point = {
  row: number;
  col: number;
  steps: number;
};

const garden = readInput({ test: false, split: true, clear: true }).map((row) =>
  row.split(""),
);

const steps = 26501365;

const startPoint: Point = {
  row: 0,
  col: 0,
  steps,
};
for (let row = 1; row < garden.length - 1; row++) {
  for (let col = 1; col < garden[0].length - 1; col++) {
    if (garden[row][col] === "S") {
      startPoint.row = row;
      startPoint.col = col;
      break;
    }
  }
}

const pointToString = (point: Point) => `${point.row},${point.col}`;
const posToString = (row: number, col: number) => `${row},${col}`;

const fill = (startRow: number, startCol: number, steps: number) => {
  const start: Point = {
    row: startRow,
    col: startCol,
    steps,
  };

  const spots = new Set<string>();
  const seen: string[] = [pointToString(start)];
  const queue: Point[] = [start];

  while (queue.length) {
    const point = queue.shift()!;
    const { row, col, steps } = point;

    if (steps % 2 === 0) {
      spots.add(pointToString(point));
    }
    if (steps === 0) {
      continue;
    }

    [
      { row: row + 1, col },
      { row: row - 1, col },
      { row, col: col + 1 },
      { row, col: col - 1 },
    ].forEach(({ row, col }) => {
      if (
        row < 0 ||
        row >= garden.length ||
        col < 0 ||
        col >= garden[0].length ||
        garden[row][col] === "#" ||
        seen.includes(posToString(row, col))
      ) {
        return;
      }
      seen.push(posToString(row, col));
      queue.push({ row, col, steps: steps - 1 });
    });
  }

  return spots.size;
};

const size = garden.length;
const gridWidth = Math.floor(steps / size) - 1;

const oddGridCount = Math.pow(Math.floor(gridWidth / 2) * 2 + 1, 2);
const evenGridCount = Math.pow(Math.floor((gridWidth + 1) / 2) * 2, 2);

const oddGridPointCount = fill(startPoint.row, startPoint.col, size * 2 + 1);
const evenGridPointCount = fill(startPoint.row, startPoint.col, size * 2);

const cornerTopPointCount = fill(size - 1, startPoint.col, size - 1);
const cornerRightPointCount = fill(startPoint.row, 0, size - 1);
const cornerBotPointCount = fill(0, startPoint.col, size - 1);
const cornerLeftPointCount = fill(startPoint.row, size - 1, size - 1);

const smallTopRightPointCount = fill(size - 1, 0, Math.floor(size / 2) - 1);
const smallTopLeftPointCount = fill(
  size - 1,
  size - 1,
  Math.floor(size / 2) - 1,
);
const smallBotRightPointCount = fill(0, 0, Math.floor(size / 2) - 1);
const smallBotLeftPointCount = fill(0, size - 1, Math.floor(size / 2) - 1);

const largeTopRightPointCount = fill(
  size - 1,
  0,
  Math.floor((size * 3) / 2) - 1,
);
const largeTopLeftPointCount = fill(
  size - 1,
  size - 1,
  Math.floor((size * 3) / 2) - 1,
);
const largeBotRightPointCount = fill(0, 0, Math.floor((size * 3) / 2) - 1);
const largeBotLeftPointCount = fill(
  0,
  size - 1,
  Math.floor((size * 3) / 2) - 1,
);

const result =
  oddGridCount * oddGridPointCount +
  evenGridCount * evenGridPointCount +
  cornerTopPointCount +
  cornerRightPointCount +
  cornerBotPointCount +
  cornerLeftPointCount +
  (gridWidth + 1) *
    (smallTopRightPointCount +
      smallTopLeftPointCount +
      smallBotRightPointCount +
      smallBotLeftPointCount) +
  gridWidth *
    (largeTopRightPointCount +
      largeTopLeftPointCount +
      largeBotRightPointCount +
      largeBotLeftPointCount);
console.log("Result: ", result);
