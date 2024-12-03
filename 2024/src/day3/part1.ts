import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false });
console.clear();

const regex = /mul\([\d]+,[\d]+\)/g;
let match: RegExpExecArray | null;
let operations: string[] = [];
while ((match = regex.exec(input)) !== null) {
  operations.push(match[0]);
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

assertResult(161, result);
