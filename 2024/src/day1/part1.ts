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

left.sort();
right.sort();

const result = zip(left, right)
  .map(([l, r]) => Math.abs(l - r))
  .reduce((a, b) => a + b, 0);

assertResult(11, result);
