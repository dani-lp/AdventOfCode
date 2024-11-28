import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true });

type Direction = "R" | "L" | "D" | "U";

type Instruction = {
  direction: Direction;
  meters: number;
};

type Point = {
  row: number;
  column: number;
};

const directions: Direction[] = ["R", "L", "D", "U"];
const isDirection = (str: unknown): str is Direction =>
  directions.includes(str as Direction);
const printGrid = (grid: string[][]) => {
  console.log(grid.map((row) => row.join("")).join("\n"));
};

const directionMap: Record<string, Direction> = {
  0: "R",
  1: "D",
  2: "L",
  3: "U",
};

const instructions: Instruction[] = input
  .map((row) => {
    const [, , rawRgb] = row.split(" ");
    if (!rawRgb) {
      return null;
    }
    const meters = parseInt(rawRgb.substring(2, 7), 16);
    const direction = directionMap[rawRgb.charAt(rawRgb.length - 2)];

    if (!direction) {
      return null;
    }

    return {
      direction,
      meters,
    } satisfies Instruction;
  })
  .filter(Boolean) as Instruction[];

let currentPosition: Point = {
  row: 0,
  column: 0,
};
const edges: [number, number][] = [];

instructions.forEach(({ direction, meters }) => {
  let newPosition: Point;
  switch (direction) {
    case "R":
      newPosition = {
        row: currentPosition.row,
        column: currentPosition.column + meters,
      };
      break;
    case "L":
      newPosition = {
        row: currentPosition.row,
        column: currentPosition.column - meters,
      };
      break;
    case "D":
      newPosition = {
        row: currentPosition.row + meters,
        column: currentPosition.column,
      };
      break;
    case "U":
      newPosition = {
        row: currentPosition.row - meters,
        column: currentPosition.column,
      };
      break;
  }

  edges.push([newPosition.row, newPosition.column]);
  currentPosition = newPosition;
});

const shoelace = (vertices: [number, number][]): number => {
  const numVertices = vertices.length;

  if (numVertices < 3) {
    throw new Error(
      "At least three vertices are required to calculate the area.",
    );
  }

  let area = 0;

  for (let i = 0; i < numVertices; i++) {
    const x1 = vertices[i][0];
    const y1 = vertices[i][1];
    const x2 = vertices[(i + 1) % numVertices][0];
    const y2 = vertices[(i + 1) % numVertices][1];

    area += x1 * y2 - x2 * y1;
  }

  area = Math.abs(area) / 2;

  return area;
};

const edgeCount = instructions.map((i) => i.meters).reduce((a, b) => a + b, 0);
const area = shoelace(edges);
const interiorPoints = area - edgeCount / 2 + 1;
const result = edgeCount + interiorPoints;
assertResult(952408144115, result);