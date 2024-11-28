import { assertResult, readInput } from "../utils";

const TEST = false;

const pipes = readInput({ test: TEST, split: true, clear: true })
  .map((line) => line.split(""))
  .map((line) => [".", ...line, "."]);
const paddingArray = Array.from({ length: pipes[0]?.length ?? 0 }, (_) => ".");
pipes.unshift(paddingArray);
pipes.push(paddingArray);

type Position = {
  x: number;
  y: number;
};

const printPipes = (pipes: string[][]) => {
  console.log(pipes.map((line) => line.join("")).join("\n"));
};

const printPipesNum = (pipes: number[][]) => {
  console.log(pipes.map((line) => line.join(" ")).join("\n\n"));
};

const pipesWithTopConnection = ["|", "L", "J", "S"];
const pipesWithBottomConnection = ["|", "7", "F", "S"];
const pipesWithLeftConnection = ["-", "J", "7", "S"];
const pipesWithRightConnection = ["-", "L", "F", "S"];

const start: Position = { x: 0, y: 0 };

const getPipeAndNeighbors = (pipes: string[][], x: number, y: number) => {
  const pipe = pipes[x]?.[y];

  const pipeOnTop = pipes[x - 1]?.[y];
  const pipeOnBottom = pipes[x + 1]?.[y];
  const pipeOnLeft = pipes[x]?.[y - 1];
  const pipeOnRight = pipes[x]?.[y + 1];

  if (!pipe || !pipeOnTop || !pipeOnBottom || !pipeOnLeft || !pipeOnRight) {
    console.error("Error: some non-adjacent tile found.", {
      pipeOnTop,
      pipeOnBottom,
      pipeOnLeft,
      pipeOnRight,
    });
    process.exit(1);
  }

  return { pipe, pipeOnTop, pipeOnBottom, pipeOnLeft, pipeOnRight };
};

/**
 * Perform an iteration on all pipes, removing the ones without connections.
 * @param pipes Bi-dimensional list of pipes
 * @returns Number of pipes removed
 */
const clearPipes = (pipes: string[][]): number => {
  let changes = 0;

  for (let y = 1; y < pipes.length - 1; y++) {
    for (let x = 1; x < (pipes[y]?.length ?? 2) - 1; x++) {
      const { pipe, pipeOnTop, pipeOnBottom, pipeOnLeft, pipeOnRight } =
        getPipeAndNeighbors(pipes, x, y);

      switch (pipe) {
        case "|":
          if (
            !pipesWithBottomConnection.includes(pipeOnTop) ||
            !pipesWithTopConnection.includes(pipeOnBottom)
          ) {
            pipes[x]![y] = "."; // checked before, so we ignore TS indexed access check
            changes++;
          }
          break;
        case "-":
          if (
            !pipesWithLeftConnection.includes(pipeOnRight) ||
            !pipesWithRightConnection.includes(pipeOnLeft)
          ) {
            pipes[x]![y] = ".";
            changes++;
          }
          break;
        case "L":
          if (
            !pipesWithBottomConnection.includes(pipeOnTop) ||
            !pipesWithLeftConnection.includes(pipeOnRight)
          ) {
            pipes[x]![y] = ".";
            changes++;
          }
          break;
        case "J":
          if (
            !pipesWithBottomConnection.includes(pipeOnTop) ||
            !pipesWithRightConnection.includes(pipeOnLeft)
          ) {
            pipes[x]![y] = ".";
            changes++;
          }
          break;
        case "7":
          if (
            !pipesWithTopConnection.includes(pipeOnBottom) ||
            !pipesWithRightConnection.includes(pipeOnLeft)
          ) {
            pipes[x]![y] = ".";
            changes++;
          }
          break;
        case "F":
          if (
            !pipesWithTopConnection.includes(pipeOnBottom) ||
            !pipesWithLeftConnection.includes(pipeOnRight)
          ) {
            pipes[x]![y] = ".";
            changes++;
          }
          break;

        case ".":
          continue;
        case "S":
          start.x = x;
          start.y = y;
          break;

        default:
          console.error("Error: No pipe found");
          process.exit(1);
      }
    }
  }

  return changes;
};

const getNearbyPositions = (
  pipes: string[][],
  x: number,
  y: number,
): Position[] => {
  const { pipe } = getPipeAndNeighbors(pipes, x, y);

  const pipeOnTopPosition = { x: x - 1, y };
  const pipeOnBottomPosition = { x: x + 1, y };
  const pipeOnLeftPosition = { x, y: y - 1 };
  const pipeOnRightPosition = { x, y: y + 1 };

  switch (pipe) {
    case "|":
      return [pipeOnTopPosition, pipeOnBottomPosition];
    case "-":
      return [pipeOnLeftPosition, pipeOnRightPosition];
    case "L":
      return [pipeOnTopPosition, pipeOnRightPosition];
    case "J":
      return [pipeOnTopPosition, pipeOnLeftPosition];
    case "7":
      return [pipeOnBottomPosition, pipeOnLeftPosition];
    case "F":
      return [pipeOnBottomPosition, pipeOnRightPosition];
  }

  return [];
};

// 1.- Clean up un-connected pipes
let changes = clearPipes(pipes);
while (changes > 0) {
  changes = clearPipes(pipes);
}

// 2.- Manual change of starting pipe
pipes[start.x]![start.y] = TEST ? "F" : "|";

// 3.- Compute distances in parallel, on both directions of the loop
const distancesMatrix = Array.from({ length: pipes.length }, () =>
  Array.from({ length: pipes[0]?.length ?? 0 }, () => 0),
);

let completed = false;
let distance = 1;

// TEST = "F", !TEST = "|"
const leftPosition: Position = TEST
  ? { x: start.x, y: start.y + 1 }
  : { x: start.x - 1, y: start.y };
const rightPosition: Position = { x: start.x + 1, y: start.y };

const checkedPositions: Position[] = [start];

while (!completed) {
  // 1.- Set distances of leftPosition/rightPosition in distancesMatrix
  distancesMatrix[leftPosition.x]![leftPosition.y] = distance;
  distancesMatrix[rightPosition.x]![rightPosition.y] = distance;

  // 2.- Mark leftPosition/rightPosition as checked
  checkedPositions.push({ ...leftPosition }, { ...rightPosition });

  // 3.- Get next leftPosition/rightPosition
  const leftNextPositions = getNearbyPositions(
    pipes,
    leftPosition.x,
    leftPosition.y,
  ).filter(
    (newPosition) =>
      !checkedPositions.some(
        (position) =>
          newPosition.x === position.x && newPosition.y === position.y,
      ),
  );
  const rightNextPositions = getNearbyPositions(
    pipes,
    rightPosition.x,
    rightPosition.y,
  ).filter(
    (newPosition) =>
      !checkedPositions.some(
        (position) =>
          newPosition.x === position.x && newPosition.y === position.y,
      ),
  );
  const leftNextPosition = leftNextPositions[0];
  const rightNextPosition = rightNextPositions[0];

  // 4.- Increase distance counter
  distance++;

  // 5.- If both are unresolvable, break from the loop
  if (
    leftNextPosition &&
    rightNextPosition &&
    leftNextPosition.x === rightNextPosition.x &&
    leftNextPosition.y === rightNextPosition.y
  ) {
    distancesMatrix[leftNextPosition.x]![leftNextPosition.y] = distance;
    completed = true;
  }

  if (leftNextPosition) {
    leftPosition.x = leftNextPosition.x;
    leftPosition.y = leftNextPosition.y;
  }
  if (rightNextPosition) {
    rightPosition.x = rightNextPosition.x;
    rightPosition.y = rightNextPosition.y;
  }
}

// ----------------- PART 2 STUFF -----------------
// 4.- Iterate over the distances matrix to remove elements from the original pipes
for (let y = 1; y < distancesMatrix.length - 1; y++) {
  for (let x = 1; x < (distancesMatrix[y]?.length ?? 2) - 1; x++) {
    if (x === start.x && y === start.y) continue;

    const distance = distancesMatrix[x]![y];

    if (distance === 0) {
      pipes[x]![y] = ".";
    }
  }
}

// 4.5 - Add lines in between
const clonedPipes = pipes.map((row) => row.slice());
for (let i = 0; i < clonedPipes.length; i++) {
  // Iterate through columns
  for (let j = clonedPipes[i]!.length - 1; j > 0; j--) {
    // Insert the element at every other index in each row
    clonedPipes[i]!.splice(j, 0, ".");
  }
}
const dotsRow = Array.from({ length: clonedPipes.length * 2 - 1 }, () => ".");
const extendedPipes = clonedPipes.map((row) => [[...row], [...dotsRow]]).flat();

for (let y = 1; y < extendedPipes.length - 1; y++) {
  for (let x = 1; x < (extendedPipes[y]?.length ?? 2) - 1; x++) {
    if (y % 2 === 1 || x % 2 === 1) continue;

    const pipe = extendedPipes[x]![y];

    switch (pipe) {
      case "|":
        extendedPipes[x - 1]![y] = "|";
        extendedPipes[x + 1]![y] = "|";
        break;
      case "-":
        extendedPipes[x]![y - 1] = "-";
        extendedPipes[x]![y + 1] = "-";
        break;
      case "L":
        extendedPipes[x - 1]![y] = "|";
        extendedPipes[x]![y + 1] = "-";
        break;
      case "J":
        extendedPipes[x - 1]![y] = "|";
        extendedPipes[x]![y - 1] = "-";
        break;
      case "7":
        extendedPipes[x + 1]![y] = "|";
        extendedPipes[x]![y - 1] = "-";
        break;
      case "F":
        extendedPipes[x + 1]![y] = "|";
        extendedPipes[x]![y + 1] = "-";
        break;
    }
  }
}

// 5.- Starting from (1,1), mark all points near other points with an X
const markingStart: Position = { x: 1, y: 1 };
let targetPoints: Position[] = [markingStart];

do {
  // 1.- For each target point, get the new neighbors to check (those which are a '.'), and remove duplicates
  const allEmptyNeighbors = targetPoints
    .map(({ x, y }) => {
      const allNeighbors = [
        { x: x - 1, y: y - 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x - 1, y: y },
        { x: x, y: y },
        { x: x + 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x + 1, y: y + 1 },
      ].filter(({ x, y }) => extendedPipes[x]?.[y] === ".");
      return allNeighbors;
    })
    .flat();

  const emptyNeighbors = allEmptyNeighbors.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      allEmptyNeighbors.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });

  // 2.- Mark them with an "X"
  emptyNeighbors.forEach(({ x, y }) => {
    extendedPipes[x]![y] = "X";
  });

  // 3.- Set the new targetPoints
  targetPoints = emptyNeighbors;
} while (targetPoints.length > 0);

const reducedPipes = extendedPipes
  .map((row, rowIndex) => {
    const reducedRow = row
      .map((el, columnIndex) => {
        return columnIndex % 2 === 1 ? null : el;
      })
      .filter(Boolean);

    return rowIndex % 2 === 1 ? null : reducedRow;
  })
  .filter(Boolean);

const result = reducedPipes.flat().filter((pipe) => pipe === ".").length;
console.log(`Result: ${result}`);
