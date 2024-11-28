import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const numbers: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
};

const result = input
  .map((line) => {
    let firstDigit: number | null = null;
    let lastDigit: number | null = null;

    for (let i = 0; i <= line.length; i++) {
      for (let j = 1; j <= line.length; j++) {
        const substring = line.substring(i, j);

        if (!firstDigit && Object.keys(numbers).includes(substring)) {
          firstDigit = numbers[substring] ?? null;
        }
      }
    }

    for (let i = 0; i <= line.length; i++) {
      for (let j = 1; j <= line.length; j++) {
        const endingSubstring = line.substring(
          line.length - i,
          line.length - j,
        );

        if (!lastDigit && Object.keys(numbers).includes(endingSubstring)) {
          lastDigit = numbers[endingSubstring] ?? null;
        }
      }
    }

    return parseInt(`${firstDigit}${lastDigit}`);
  })
  .reduce((a, b) => a + b, 0);

assertResult(281, result);
