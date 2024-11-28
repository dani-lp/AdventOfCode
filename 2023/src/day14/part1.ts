import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true }).map((row) =>
  row.split(""),
);

const printPlatform = (platform: string[][]) =>
  console.log(platform.map((row) => row.join("")).join("\n"));

// apply padding
const cubeRocksRow = Array.from({ length: input.length + 2 }, () => "#");
const platform = [[...cubeRocksRow]]
  .concat(input.map((row) => ["#", ...row, "#"]))
  .concat([[...cubeRocksRow]]);

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

const result = platform
  .map((row, index) => {
    const roundedRockCount = row.join("").match(/\O/g)?.length ?? 0;
    return roundedRockCount * (platform.length - index - 1);
  })
  .reduce((a, b) => a + b, 0);
assertResult(136, result);
