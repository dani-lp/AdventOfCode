import { assertResult, readInput } from "../utils";

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
type Box = {
  left: Position;
  right: Position;
};

const grid = gridInput.split("\n").map((row) =>
  row.split("").flatMap((c) => {
    if (c === "@") return ["@", "."];
    if (c === "O") return ["[", "]"];
    return [c, c];
  }),
);
const moves: Move[] = movesInput
  .split("")
  .filter((c) => c !== "\n")
  .map((c) => charToMove[c]);

const boxes: Box[] = [];
let robotPosition: Position = { x: -1, y: -1 };

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const gridChar = grid[y][x];
    if (gridChar === "[")
      boxes.push({
        left: { x, y },
        right: { x: x + 1, y },
      });
    else if (gridChar === "@") robotPosition = { x, y };
  }
}

const printBoxesGrid = () => {
  console.log(
    "  " +
      Array.from({ length: grid[0].length }, (_, i) =>
        i.toString().slice(-1),
      ).join(""),
  );
  for (let y = 0; y < grid.length; y++) {
    let row = `${y} `;
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "#") row += "#";
      else if (x === robotPosition.x && y === robotPosition.y) row += "@";
      else if (boxes.some((box) => box.left.x === x && box.left.y === y))
        row += "[";
      else if (boxes.some((box) => box.right.x === x && box.right.y === y))
        row += "]";
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

const isTopBoxFree = (box: Box): { free: boolean; boxes: Box[] } => {
  const toDoSet = new Array<Box>();
  const doneSet = new Array<Box>();
  toDoSet.push(box);

  while (toDoSet.length) {
    const baseBox = toDoSet.shift()!;
    doneSet.push(baseBox);

    const topLeftGridChar = grid[baseBox.left.y - 1][baseBox.left.x];
    const topRightGridChar = grid[baseBox.right.y - 1][baseBox.right.x];

    if (topLeftGridChar === "#" || topRightGridChar === "#")
      return { free: false, boxes: [] };

    const topLeftBox = boxes.find(
      (box) =>
        (box.left.x === baseBox.left.x || box.right.x === baseBox.left.x) &&
        box.left.y === baseBox.left.y - 1,
    );
    const topRightBox = boxes.find(
      (box) =>
        (box.left.x === baseBox.right.x || box.right.x === baseBox.right.x) &&
        box.left.y === baseBox.left.y - 1,
    );
    const nextBoxes = [topLeftBox, topRightBox].filter(Boolean) as Box[];

    for (const box of nextBoxes) {
      if (
        !doneSet.some(
          (doneSetBox) =>
            doneSetBox.left.x === box.left.x &&
            doneSetBox.left.y === box.left.y,
        ) &&
        !toDoSet.some(
          (toDoSetBox) =>
            toDoSetBox.left.x === box.left.x &&
            toDoSetBox.left.y === box.left.y,
        )
      ) {
        toDoSet.push(box);
      }
    }
  }

  return { free: true, boxes: doneSet };
};

const isBottomBoxFree = (box: Box): { free: boolean; boxes: Box[] } => {
  const toDoSet = new Array<Box>();
  const doneSet = new Array<Box>();
  toDoSet.push(box);

  while (toDoSet.length) {
    const baseBox = toDoSet.shift()!;
    doneSet.push(baseBox);

    const bottomLeftGridChar = grid[baseBox.left.y + 1][baseBox.left.x];
    const bottomRightGridChar = grid[baseBox.right.y + 1][baseBox.right.x];

    if (bottomLeftGridChar === "#" || bottomRightGridChar === "#")
      return { free: false, boxes: [] };

    const bottomLeftBox = boxes.find(
      (box) =>
        (box.left.x === baseBox.left.x || box.right.x === baseBox.left.x) &&
        box.left.y === baseBox.left.y + 1,
    );
    const bottomRightBox = boxes.find(
      (box) =>
        (box.left.x === baseBox.right.x || box.right.x === baseBox.right.x) &&
        box.left.y === baseBox.left.y + 1,
    );
    const nextBoxes = [bottomLeftBox, bottomRightBox].filter(Boolean) as Box[];

    for (const box of nextBoxes) {
      if (
        !doneSet.some(
          (doneSetBox) =>
            doneSetBox.left.x === box.left.x &&
            doneSetBox.left.y === box.left.y,
        ) &&
        !toDoSet.some(
          (toDoSetBox) =>
            toDoSetBox.left.x === box.left.x &&
            toDoSetBox.left.y === box.left.y,
        )
      ) {
        toDoSet.push(box);
      }
    }
  }

  return { free: true, boxes: doneSet };
};

const getVerticalBoxes = (x: number, y: number, move: Move): Box[] => {
  const [nextX, nextY] = getNextPosition(x, y, move);

  const nextBox = boxes.find(
    (box) =>
      (box.left.x === nextX && box.left.y === nextY) ||
      (box.right.x === nextX && box.right.y === nextY),
  );

  if (!nextBox) {
    return [];
  }

  const getNextBoxes = move === "down" ? isBottomBoxFree : isTopBoxFree;
  const { free, boxes: newBoxes } = getNextBoxes(nextBox);
  if (!free) {
    return [];
  }

  return newBoxes;
};

const getBoxesInRow = (x: number, y: number, move: Move): Box[] => {
  const boxesInRow: Box[] = [];

  let currentX = x;
  let currentY = y;
  let gridElement = grid[currentY][currentX];
  if (move === "up" || move === "down") {
    return getVerticalBoxes(x, y, move);
  }

  while (gridElement !== "#") {
    const [nextX, nextY] = getNextPosition(currentX, currentY, move);
    const nextBox = boxes.find((box) => {
      if (move === "left")
        return box.right.x === nextX && box.right.y === nextY;
      if (move === "right") return box.left.x === nextX && box.left.y === nextY;
    });

    if (!nextBox) {
      break;
    }

    boxesInRow.push(nextBox);
    const [extraNextX, extraNextY] = getNextPosition(nextX, nextY, move);
    currentX = extraNextX;
    currentY = extraNextY;
  }
  const [nextX, nextY] = getNextPosition(currentX, currentY, move);
  if (grid[nextY][nextX] === "#") {
    return [];
  }

  return boxesInRow;
};

moves.forEach((move) => {
  const DEBUG = false;

  DEBUG && printBoxesGrid();
  DEBUG && console.log("\n");

  const [nextX, nextY] = getNextPosition(
    robotPosition.x,
    robotPosition.y,
    move,
  );

  const gridChar = grid[nextY][nextX];
  if (gridChar === "#") {
    return;
  }

  if (
    !boxes.some(
      (box) =>
        (box.left.x === nextX && box.left.y === nextY) ||
        (box.right.x === nextX && box.right.y === nextY),
    )
  ) {
    robotPosition = { x: nextX, y: nextY };
    return;
  }

  const boxesToPush = getBoxesInRow(robotPosition.x, robotPosition.y, move);
  if (!boxesToPush.length) {
    return;
  }

  boxesToPush.forEach((box) => {
    const [nextBoxLeftX, nextBoxLeftY] = getNextPosition(
      box.left.x,
      box.left.y,
      move,
    );
    const [nextBoxRightX, nextBoxRightY] = getNextPosition(
      box.right.x,
      box.right.y,
      move,
    );
    box.left.x = nextBoxLeftX;
    box.left.y = nextBoxLeftY;
    box.right.x = nextBoxRightX;
    box.right.y = nextBoxRightY;
  });
  robotPosition = { x: nextX, y: nextY };
});

const result = boxes
  .map(({ left }) => left.y * 100 + left.x)
  .reduce((a, b) => a + b, 0);
assertResult(9021, result);
