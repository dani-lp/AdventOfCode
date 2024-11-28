import { assertResult, readInput } from "../utils";

const TEST = false;

const universe = readInput({ test: TEST, clear: true, split: true }).map(
  (row) => row.split(""),
);

const range = (from: number, length: number) =>
  Array.from({ length }, (_, i) => i + from);

type Position = {
  x: number;
  y: number;
};

const printUniverse = (universe: string[][]) => {
  console.log(universe.map((row) => row.join("")).join("\n"));
};

// 1.- Get expanded universe rows and columns
const extraRows: number[] = [];
const extraColumns: number[] = [];

for (let i = 0; i < universe.length; i++) {
  if (universe[i]?.every((element) => element === ".")) {
    extraRows.push(i);
  }
}

for (let i = 0; i < universe[0]!.length; i++) {
  if (universe.map((row) => row[i]!).every((element) => element === ".")) {
    extraColumns.push(i);
  }
}

// 2.- Find galaxies and pair them
const galaxies: Position[] = [];

for (let y = 0; y < universe.length; y++) {
  for (let x = 0; x < universe[y]!.length; x++) {
    if (universe[y]![x] === "#") {
      galaxies.push({ x, y });
    }
  }
}

const galaxyPairs: [Position, Position][] = [];
for (let i = 0; i < galaxies.length; i++) {
  for (let j = i; j < galaxies.length - 1; j++) {
    galaxyPairs.push([galaxies[i]!, galaxies[j + 1]!]);
  }
}

// 3.- Compute distances
const EXPANSION = TEST ? 100 : 1_000_000;

const distance = ([{ x: x1, y: y1 }, { x: x2, y: y2 }]: [
  Position,
  Position,
]) => {
  const horizontalRange = range(Math.min(x1, x2) + 1, Math.abs(x1 - x2) - 1);
  const verticalRange = range(Math.min(y1, y2) + 1, Math.abs(y1 - y2) - 1);

  const horizontalExpansions = extraColumns.filter((column) =>
    horizontalRange.includes(column),
  ).length;
  const verticalExpansions = extraRows.filter((row) =>
    verticalRange.includes(row),
  ).length;

  return (
    Math.abs(x1 - x2) +
    (EXPANSION - 1) * horizontalExpansions +
    (Math.abs(y1 - y2) + (EXPANSION - 1) * verticalExpansions)
  );
};

const result = galaxyPairs.map(distance).reduce((a, b) => a + b, 0);
assertResult(8410, result);
