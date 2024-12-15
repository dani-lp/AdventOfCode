import { assertResult, printGrid, readInput } from "../utils";

const [gridInput, movesInput] = readInput({ test: false, split: false }).split(
  "\n\n",
);
console.clear();

type Move = "up" | "down" | "left" | "right";
const charToMove: Record<string, Move> = {
  "^": "up",
  v: "down",
  "<": "left",
  ">": "right",
};
type Position = {
  x: number;
  y: number;
};

const grid = gridInput.split("\n").map((row) => row.split(""));
const moves: Move[] = movesInput
  .split("")
  .filter((c) => c !== "\n")
  .map((c) => charToMove[c]);

const boxes: Position[] = [];
let robotPosition: Position = { x: -1, y: -1 };

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const gridChar = grid[y][x];
    if (gridChar === "O") boxes.push({ x, y });
    else if (gridChar === "@") robotPosition = { x, y };
  }
}

const printBoxesGrid = () => {
  for (let y = 0; y < grid.length; y++) {
    let row = "";
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "#") row += "#";
      else if (x === robotPosition.x && y === robotPosition.y) row += "@";
      else if (boxes.some((box) => box.x === x && box.y === y)) row += "0";
      else row += ".";
    }
    console.log(row);
  }
};

const getNextPosition = (
  x: number,
  y: number,
  move: Move,
): [x: number, y: number] => {
  switch (move) {
    case "up":
      return [x, y - 1] as const;
    case "down":
      return [x, y + 1] as const;
    case "left":
      return [x - 1, y] as const;
    case "right":
      return [x + 1, y] as const;
  }
};

const getBoxesInRow = (x: number, y: number, move: Move): Position[] => {
  const boxesInRow: Position[] = [];

  let currentX = x;
  let currentY = y;
  let gridElement = grid[currentY][currentX];
  while (gridElement !== "#") {
    const [nextX, nextY] = getNextPosition(currentX, currentY, move);
    const nextBox = boxes.find((box) => box.x === nextX && box.y === nextY);

    if (!nextBox) {
      break;
    }

    boxesInRow.push(nextBox);
    currentX = nextX;
    currentY = nextY;
  }
  const [nextX, nextY] = getNextPosition(currentX, currentY, move);
  if (grid[nextY][nextX] === "#") {
    return [];
  }

  return boxesInRow;
};

moves.forEach((move, i) => {
  const DEBUG = false;

  const [nextX, nextY] = getNextPosition(
    robotPosition.x,
    robotPosition.y,
    move,
  );

  DEBUG && console.log(`Move: ${move} (#${i}) (${nextX}, ${nextY})`);

  const gridChar = grid[nextY][nextX];
  if (gridChar === "#") {
    DEBUG && printBoxesGrid();
    DEBUG && console.log("\n");
    return;
  }
  if (!boxes.some((box) => box.x === nextX && box.y === nextY)) {
    robotPosition = { x: nextX, y: nextY };
    DEBUG && printBoxesGrid();
    DEBUG && console.log("\n");
    return;
  }

  const boxesToPush = getBoxesInRow(robotPosition.x, robotPosition.y, move);
  DEBUG && console.log("To push:", boxesToPush);

  if (!boxesToPush.length) {
    DEBUG && printBoxesGrid();
    DEBUG && console.log("\n");
    return;
  }

  boxesToPush.forEach((box) => {
    const [nextBoxX, nextBoxY] = getNextPosition(box.x, box.y, move);
    box.x = nextBoxX;
    box.y = nextBoxY;
  });
  robotPosition = { x: nextX, y: nextY };

  DEBUG && printBoxesGrid();
  DEBUG && console.log("\n");
});

const result = boxes
  .map((box) => box.y * 100 + box.x)
  .reduce((a, b) => a + b, 0);
assertResult(10092, result);
