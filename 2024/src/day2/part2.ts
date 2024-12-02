import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const isReportSafe = (report: number[]): boolean => {
  const distances = report
    .map((level, i, levels) => level - (levels[i + 1] ?? 0))
    .slice(0, -1);

  return (
    (distances.every((v) => v > 0) || distances.every((v) => v < 0)) &&
    distances.every((v) => Math.abs(v) >= 1 && Math.abs(v) <= 3)
  );
};

const result = input
  .map((report) => report.split(" ").map(Number))
  .map((report) => report.map((_, i, arr) => arr.filter((__, j) => j !== i)))
  .filter((reports) => reports.some(isReportSafe)).length;

assertResult(4, result);
