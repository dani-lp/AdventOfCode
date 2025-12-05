import { assertResult, range, readInput } from "../utils";

type Range = {
  start: number;
  end: number;
};

const getRangesOverlap = (r1: Range, r2: Range): Range[] => {
  const intersectionStart = Math.max(r1.start, r2.start);
  const intersectionEnd = Math.min(r1.end, r2.end);

  if (intersectionStart > intersectionEnd) {
    return [{ ...r2 }];
  }

  const result: Range[] = [];
  if (r2.start < intersectionStart) {
    result.push({ start: r2.start, end: intersectionStart - 1 });
  }

  if (r2.end > intersectionEnd) {
    result.push({ start: intersectionEnd + 1, end: r2.end });
  }

  return result;
};

let ranges: (Range | null)[] = readInput({
  test: false,
  split: false,
  clear: true,
})
  .split("\n\n")
  .map((block) => block.split("\n"))[0]
  .map((range) => {
    const [start, end] = range.split("-");
    return {
      start: Number(start),
      end: Number(end),
    };
  });

let i = 0;
while (i < ranges.length) {
  const rangeToCheck = ranges[i];

  if (!rangeToCheck) {
    i++;
    continue;
  }

  const allOverlaps: Range[] = [];
  for (let j = i + 1; j < ranges.length; j++) {
    const newRange = ranges[j];
    if (!newRange) {
      continue;
    }
    const overlaps = getRangesOverlap(rangeToCheck, newRange);
    allOverlaps.push(...overlaps);
    ranges[j] = null;
  }

  ranges.push(...allOverlaps);
  i++;
}

const result = (ranges.filter(Boolean) as Range[])
  .map(({ start, end }) => end + 1 - start)
  .reduce((a, b) => a + b, 0);
assertResult(14, result);
