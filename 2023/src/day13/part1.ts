import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false, clear: true })
  .split("\n\n")
  .map((pattern) => pattern.split("\n"));

const transposePattern = (basePattern: string[]): string[] => {
  const pattern = basePattern.map((row) => row.split(""));
  const transposed = pattern[0]?.map((_, colIndex) =>
    pattern.map((row) => row[colIndex]),
  );
  return transposed?.map((row) => row.join("")) ?? [];
};

const getReflectionRow = (basePattern: string[]): number | null => {
  for (let row = 1; row < basePattern.length; row++) {
    const topSide = basePattern.map((row) => row.slice());
    const bottomSide = topSide.splice(row, topSide.length);
    topSide.reverse();

    const minLength = Math.min(topSide.length, bottomSide.length);
    const top = topSide.slice(0, minLength);
    const bot = bottomSide.slice(0, minLength);

    const isReflection = top.every((el, index) => el === bot[index]);
    if (isReflection) {
      return row;
    }
  }
  return null;
};

const result = input
  .map((basePattern) => {
    const horizontal = getReflectionRow(basePattern);
    const vertical = getReflectionRow(transposePattern(basePattern));

    return { horizontal, vertical };
  })
  .map(({ horizontal, vertical }) => (vertical ?? 0) + 100 * (horizontal ?? 0))
  .reduce((a, b) => a + b, 0);
assertResult(405, result);
