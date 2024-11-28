import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true }).map((row) =>
  row.split(""),
);

const printPlatform = (platform: string[][]) =>
  console.log(platform.map((row) => row.join("")).join("\n"));

const CYCLES = 1_000_000_000;

// apply padding
const cubeRocksRow = Array.from({ length: input.length + 2 }, () => "#");
const platform = [[...cubeRocksRow]]
  .concat(input.map((row) => ["#", ...row, "#"]))
  .concat([[...cubeRocksRow]]);

const memoization: [string, string[][]][] = [];
const indexes = new Set<number>();
let minIteration: number | null = null;

let resultPlatform: string[][] | null = null;

for (let i = 0; i < CYCLES; i++) {
  // north
  let finished = false;
  while (!finished) {
    // 1.- change
    for (let y = 1; y < platform.length - 1; y++) {
      for (let x = 1; x < platform[y]!.length - 1; x++) {
        const element = platform[y]![x];

        if (element === "O" && platform[y - 1]![x] === ".") {
          platform[y]![x] = ".";
          platform[y - 1]![x] = "O";
        }
      }
    }

    // 2.- check
    let complete = true;
    for (let y = 1; y < platform.length - 1; y++) {
      for (let x = 1; x < platform[y]!.length - 1; x++) {
        const element = platform[y]![x];

        if (element === "O") {
          complete = complete && platform[y - 1]![x] !== ".";
        }
      }
    }

    if (complete) finished = true;
  }

  // west
  finished = false;
  while (!finished) {
    // 1.- change
    for (let y = 1; y < platform.length - 1; y++) {
      for (let x = 1; x < platform[y]!.length - 1; x++) {
        const element = platform[y]![x];

        if (element === "O" && platform[y]![x - 1] === ".") {
          platform[y]![x] = ".";
          platform[y]![x - 1] = "O";
        }
      }
    }

    // 2.- check
    let complete = true;
    for (let y = 1; y < platform.length - 1; y++) {
      for (let x = 1; x < platform[y]!.length - 1; x++) {
        const element = platform[y]![x];

        if (element === "O") {
          complete = complete && platform[y]![x - 1] !== ".";
        }
      }
    }

    if (complete) finished = true;
  }

  // south
  finished = false;
  while (!finished) {
    // 1.- change
    for (let y = 1; y < platform.length - 1; y++) {
      for (let x = 1; x < platform[y]!.length - 1; x++) {
        const element = platform[y]![x];

        if (element === "O" && platform[y + 1]![x] === ".") {
          platform[y]![x] = ".";
          platform[y + 1]![x] = "O";
        }
      }
    }

    // 2.- check
    let complete = true;
    for (let y = 1; y < platform.length - 1; y++) {
      for (let x = 1; x < platform[y]!.length - 1; x++) {
        const element = platform[y]![x];

        if (element === "O") {
          complete = complete && platform[y + 1]![x] !== ".";
        }
      }
    }

    if (complete) finished = true;
  }

  // east
  finished = false;
  while (!finished) {
    // 1.- change
    for (let y = 1; y < platform.length - 1; y++) {
      for (let x = 1; x < platform[y]!.length - 1; x++) {
        const element = platform[y]![x];

        if (element === "O" && platform[y]![x + 1] === ".") {
          platform[y]![x] = ".";
          platform[y]![x + 1] = "O";
        }
      }
    }

    // 2.- check
    let complete = true;
    for (let y = 1; y < platform.length - 1; y++) {
      for (let x = 1; x < platform[y]!.length - 1; x++) {
        const element = platform[y]![x];

        if (element === "O") {
          complete = complete && platform[y]![x + 1] !== ".";
        }
      }
    }

    if (complete) finished = true;
  }

  // memoization
  const platformStr = JSON.stringify(platform);
  const index = memoization.findIndex(([el]) => el === platformStr);
  if (index >= 0) {
    if (!minIteration) minIteration = i;
    indexes.add(index);
    if (index < Math.max(...indexes)) {
      const loopSize = Math.max(...indexes) - Math.min(...indexes) + 1;

      const maxCyclesIndex = (CYCLES - minIteration) % loopSize;
      resultPlatform =
        memoization[minIteration + maxCyclesIndex - 1]?.[1] ?? null;
      break;
    }
  }
  memoization.push([platformStr, platform.map((row) => row.slice())]);
}

const result =
  resultPlatform &&
  resultPlatform
    .map((row, index) => {
      const roundedRockCount = row.join("").match(/\O/g)?.length ?? 0;
      return roundedRockCount * (platform.length - index - 1);
    })
    .reduce((a, b) => a + b, 0);
assertResult(64, result);
