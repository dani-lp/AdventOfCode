import { assertResult, readInput, readGrid, pairs, printGrid } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const grid = input.map((r) => r.split(""));

type Position = {
  x: number;
  y: number;
};

const symbolsMap = new Map<string, Array<Position>>();
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const symbol = readGrid({ grid, x, y });
    if (!symbol || symbol === ".") continue;

    const existingPositions: Position[] = symbolsMap.get(symbol) ?? [];
    existingPositions.push({ x, y });
    symbolsMap.set(symbol, existingPositions);
  }
}

const isPointValid = (position: Position): boolean => {
  const { x, y } = position;
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
};

const getNextPointsInLine = ([p1, p2]: [Position, Position]): Position[] => {
  const xDirection = p2.x - p1.x;
  const yDirection = p2.y - p1.y;

  let nextForwardPoint: Position = {
    x: p2.x + xDirection,
    y: p2.y + yDirection,
  };
  const forwardPoints: Position[] = [];
  while (isPointValid(nextForwardPoint)) {
    forwardPoints.push(nextForwardPoint);
    nextForwardPoint = {
      x: nextForwardPoint.x + xDirection,
      y: nextForwardPoint.y + yDirection,
    };
  }

  let nextBackwardsPoint: Position = {
    x: p1.x - xDirection,
    y: p1.y - yDirection,
  };
  const backwardsPoints: Position[] = [];
  while (isPointValid(nextBackwardsPoint)) {
    backwardsPoints.push(nextBackwardsPoint);
    nextBackwardsPoint = {
      x: nextBackwardsPoint.x - xDirection,
      y: nextBackwardsPoint.y - yDirection,
    };
  }

  return [...forwardPoints, ...backwardsPoints];
};

Array.from(symbolsMap.values())
  .flatMap(pairs)
  .flatMap(([p1, p2]) => getNextPointsInLine([p1, p2]))
  .filter(isPointValid)
  .forEach(({ x, y }) => (grid[y][x] = "#"));

const result = grid.flat().filter((c) => c !== ".").length;

assertResult(34, result);
