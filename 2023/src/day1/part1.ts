import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const result = input
  .map((line) => {
    const splitLine = line.split("");
    const reversedLine = [...splitLine].reverse();

    const firstDigit = splitLine.find((el) => !isNaN(parseInt(el)));
    const lastDigit = reversedLine.find((el) => !isNaN(parseInt(el)));

    return parseInt(`${firstDigit}${lastDigit}`);
  })
  .reduce((a, b) => a + b, 0);

assertResult(142, result);
