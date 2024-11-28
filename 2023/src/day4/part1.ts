import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: true });

const result = input
  .map((line) => {
    const [_, numbers] = line.split(":") as [string, string];
    const [winningStr, ownStr] = numbers.split(" | ") as [string, string];
    const winning = winningStr
      .trim()
      .split(" ")
      .filter((num) => num !== "");
    const own = ownStr
      .trim()
      .split(" ")
      .filter((num) => num !== "");

    const matches = own.filter((num) => winning.includes(num)).length;
    return matches > 0 ? Math.pow(2, matches - 1) : 0;
  })
  .reduce((a, b) => a + b, 0);

assertResult(13, result);
