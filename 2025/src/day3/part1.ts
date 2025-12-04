import { assertResult, printGrid, readInput } from "../utils";

const result = readInput({ test: false, split: true, clear: true })
  .map((row) => row.split("").map(Number))
  .map((row) => {
    let max = 0;
    for (let i = 0; i < row.length - 1; i++) {
      for (let j = i + 1; j < row.length; j++) {
        const pair = Number(`${row[i]}${row[j]}`);
        if (pair > max) {
          max = pair;
        }
      }
    }

    return max;
  })
  .reduce((a, b) => a + b);

assertResult(357, result);
