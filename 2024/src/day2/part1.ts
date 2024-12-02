import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const result = input
  .map((report) => report.split(" ").map(Number))
  .map((report) =>
    report.map((level, i, levels) => level - (levels[i + 1] ?? 0)).slice(0, -1),
  )
  .filter((report) => report.every((v) => v > 0) || report.every((v) => v < 0))
  .filter((report) =>
    report.every((v) => Math.abs(v) >= 1 && Math.abs(v) <= 3),
  ).length;

assertResult(2, result);
