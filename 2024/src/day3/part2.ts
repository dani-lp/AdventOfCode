import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false });
console.clear();

const regex = /mul\([\d]+,[\d]+\)|do\(\)|don't\(\)/g;
let match: RegExpExecArray | null;
let operations: string[] = [];
let enabled = true;
while ((match = regex.exec(input)) !== null) {
  const m = match[0];
  if (m === "do()") {
    enabled = true;
  } else if (m === "don't()") {
    enabled = false;
  }
  if (enabled) {
    operations.push(m);
  }
}

const result = operations
  .map((op) =>
    op
      .slice(4)
      .slice(0, -1)
      .split(",")
      .map(Number)
      .reduce((a, b) => a * b, 1),
  )
  .reduce((a, b) => a + b, 0);

assertResult(48, result);
