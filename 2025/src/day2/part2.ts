import { assertResult, range, readInput } from "../utils";

const isInvalidId = (id: string): boolean => {
  const maxLength = id.length;

  let valid = false;

  for (let i = maxLength; i > 0; i--) {
    if (id.length % i !== 0) {
      continue;
    }

    const partLength = id.length / i;
    const parts: string[] = [];

    for (let j = 0; j < i; j++) {
      const start = j * partLength;
      const end = start + partLength;

      parts.push(id.slice(start, end));
    }

    if (parts.length > 1 && new Set(parts).size === 1) {
      return true;
    }
  }

  return valid;
};

const input = readInput({ test: false, split: false, clear: true });
const repeats = input
  .split(",")
  .map((row) => row.split("-").map(Number))
  .flatMap(([a, b]) => range(a, b + 1))
  .map(String)
  .filter(isInvalidId)
  .map(Number)
  .reduce((a, b) => a + b, 0);

assertResult(4174379265, repeats);
