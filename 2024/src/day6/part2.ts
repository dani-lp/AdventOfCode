import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const LIMIT_CHAR = "0";

const grid = [
  Array.from({ length: input[0].length + 2 }, () => LIMIT_CHAR),
  ...input.map((row) => `${LIMIT_CHAR}${row}${LIMIT_CHAR}`.split("")),
  Array.from({ length: input[0].length + 2 }, () => LIMIT_CHAR),
];

type Direction = "up" | "down" | "left" | "right";
type Position = {
  x: number;
  y: number;
  direction: Direction;
};

let initialPosition: Position | null = null;
for (let y = 1; y < grid.length - 1; y++) {
  for (let x = 1; x < grid[y].length - 1; x++) {
    const char = grid[y][x];
    if (char === "^") {
      initialPosition = { x, y, direction: "up" };
      break;
    } else if (char === "v") {
      initialPosition = { x, y, direction: "down" };
      break;
    } else if (char === ">") {
      initialPosition = { x, y, direction: "right" };
      break;
    } else if (char === "<") {
      initialPosition = { x, y, direction: "left" };
      break;
    }
  }
}

const rotateDirection = (direction: Direction): Direction => {
  if (direction === "down") return "left";
  if (direction === "left") return "up";
  if (direction === "up") return "right";
  if (direction === "right") return "down";
  return direction;
};

const computeNextPosition = (
  currentPosition: Readonly<Position>,
  grid: string[][],
): Position | null => {
  const { x, y, direction } = currentPosition;

  let nextPosition: Position | null = null;
  switch (currentPosition.direction) {
    case "up":
      nextPosition = { y: y - 1, x, direction };
      break;
    case "down":
      nextPosition = { y: y + 1, x, direction };
      break;
    case "left":
      nextPosition = { y, x: x - 1, direction };
      break;
    case "right":
      nextPosition = { y, x: x + 1, direction };
      break;
  }

  const gridElement = grid[nextPosition.y][nextPosition.x];
  if (gridElement === "#") {
    return {
      ...currentPosition,
      direction: rotateDirection(currentPosition.direction),
    };
  }
  if (gridElement === LIMIT_CHAR) {
    return null;
  }
  return nextPosition;
};

let loopCounter = 0;
for (let y = 1; y < grid.length - 1; y++) {
  for (let x = 1; x < grid[y].length; x++) {
    console.clear();
    console.log(
      `${Math.floor(((y * grid.length + x) * 100) / (grid.length * grid[0].length))}%`,
    );

    const existingChar = grid[y][x];
    if (existingChar !== ".") {
      continue;
    }

    const newGrid = grid.map((row, _y) =>
      row.map((el, _x) => (_y === y && _x === x ? "#" : el)),
    );

    const positionsSet: Set<string> = new Set();
    let currentPosition: Position | null = initialPosition;
    let loopFound = false;

    while (currentPosition && !loopFound) {
      const positionKey = `${currentPosition.x},${currentPosition.y},${currentPosition.direction}`;
      if (positionsSet.has(positionKey)) {
        loopFound = true;
        loopCounter++;
      } else {
        positionsSet.add(positionKey);
      }
      currentPosition = computeNextPosition(currentPosition, newGrid);
    }
  }
}

assertResult(6, loopCounter);
