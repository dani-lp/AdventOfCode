import { assertResult, readInput, zip } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const left: number[] = [];
const right: number[] = [];
input
  .map((row) => row.split("   ").map(Number))
  .forEach(([l, r]) => {
    left.push(l);
    right.push(r);
  });

const result = left
  .map((l) => l * right.filter((r) => r === l).length)
  .reduce((a, b) => a + b);

assertResult(31, result);
