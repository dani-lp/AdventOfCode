import { assertResult, readInput } from "../utils";

const baseUniverse = readInput({ test: false, clear: true, split: true }).map(
  (row) => row.split(""),
);

type Position = {
  x: number;
  y: number;
};

const printUniverse = (universe: string[][]) => {
  console.log(universe.map((row) => row.join("")).join("\n"));
};

// 1.- Expand universe
const universe = baseUniverse
  .map((row) =>
    row.every((element) => element === ".") ? [[...row], [...row]] : [[...row]],
  )
  .flat();

const positions: number[] = [];
for (let i = 0; i < universe[0]!.length; i++) {
  if (universe.map((row) => row[i]!).every((element) => element === ".")) {
    positions.push(i);
  }
}
positions.forEach((position, index) => {
  for (let i = 0; i < universe.length; i++) {
    universe[i]?.splice(position + index, 0, ".");
  }
});

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
const result = galaxyPairs
  .map(
    ([{ x: x1, y: y1 }, { x: x2, y: y2 }]) =>
      Math.abs(x1 - x2) + Math.abs(y1 - y2),
  )
  .reduce((a, b) => a + b, 0);
assertResult(374, result);
