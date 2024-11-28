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

const getReflectionRow = (basePattern: string[]): number[] => {
  const rows: number[] = [];
  for (let row = 1; row < basePattern.length; row++) {
    const topSide = basePattern.map((row) => row.slice());
    const bottomSide = topSide.splice(row, topSide.length);
    topSide.reverse();

    const minLength = Math.min(topSide.length, bottomSide.length);
    const top = topSide.slice(0, minLength);
    const bot = bottomSide.slice(0, minLength);

    const isReflection = top.every((el, index) => el === bot[index]);
    if (isReflection) {
      rows.push(row);
    }
  }
  return rows;
};

const baseReflections = input.map((basePattern) => {
  const horizontal = getReflectionRow(basePattern);
  const vertical = getReflectionRow(transposePattern(basePattern));

  return { horizontal: horizontal[0] ?? null, vertical: vertical[0] ?? null };
});

const result = input
  .map((basePattern, index) => {
    const originalReflection = baseReflections[index]!;

    const horizontalSet = new Set<number>();
    const verticalSet = new Set<number>();

    for (let y = 0; y < basePattern.length; y++) {
      for (let x = 0; x < basePattern[y]!.length; x++) {
        const pattern = basePattern.map((row) => row.split(""));
        pattern[y]![x] = pattern[y]![x] === "." ? "#" : ".";
        const patternReduced = pattern.map((row) => row.join(""));

        const { horizontal, vertical } = {
          horizontal: getReflectionRow(patternReduced),
          vertical: getReflectionRow(transposePattern(patternReduced)),
        };

        horizontal
          .filter((value) => value !== originalReflection.horizontal)
          .forEach((value) => horizontalSet.add(value));
        vertical
          .filter((value) => value !== originalReflection.vertical)
          .forEach((value) => verticalSet.add(value));
      }
    }

    return { horizontal: [...horizontalSet][0], vertical: [...verticalSet][0] };
  })
  .map(({ horizontal, vertical }) => (vertical ?? 0) + 100 * (horizontal ?? 0))
  .reduce((a, b) => a + b, 0);
assertResult(400, result);

// 31432 too low
