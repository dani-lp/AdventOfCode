import { assertResult, readInput } from "../utils";

const rows = readInput({ test: false, split: true });
console.clear();

const grid = rows.map((row) => row.split(""));

let count = 0;
for (let i = 1; i < rows.length - 1; i++) {
  for (let j = 1; j < rows[i].length - 1; j++) {
    if (grid[i][j] !== "A") {
      continue;
    }

    if (
      (grid[i - 1][j - 1] === "M" &&
        grid[i + 1][j + 1] === "S" &&
        grid[i - 1][j + 1] === "M" &&
        grid[i + 1][j - 1] === "S") ||
      (grid[i - 1][j - 1] === "S" &&
        grid[i + 1][j + 1] === "M" &&
        grid[i - 1][j + 1] === "M" &&
        grid[i + 1][j - 1] === "S") ||
      (grid[i - 1][j - 1] === "M" &&
        grid[i + 1][j + 1] === "S" &&
        grid[i - 1][j + 1] === "S" &&
        grid[i + 1][j - 1] === "M") ||
      (grid[i - 1][j - 1] === "S" &&
        grid[i + 1][j + 1] === "M" &&
        grid[i - 1][j + 1] === "S" &&
        grid[i + 1][j - 1] === "M")
    ) {
      count++;
    }
  }
}

assertResult(9, count);
