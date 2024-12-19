import { assertResult, readInput } from "../utils";

const [patternsInput, designsInput] = readInput({
  test: false,
  split: false,
}).split("\n\n");
console.clear();

const patterns = patternsInput.split(", ");
const designs = designsInput.split("\n");

const memoize = new Map<string, number>();

const validCombinations = (design: string): number => {
  if (memoize.has(design)) {
    return memoize.get(design)!;
  }

  if (design === "") return 0;
  let count = 0;

  if (design.length === 1) {
    return patterns.includes(design) ? 1 : 0;
  }

  for (let endSize = 1; endSize <= design.length; endSize++) {
    const start = design.slice(0, design.length - endSize);
    const end = design.slice(design.length - endSize);

    if (!start.length) {
      if (patterns.includes(end)) count++;
    }
    if (!end.length) {
      if (patterns.includes(start)) count++;
    }

    if (patterns.includes(end)) {
      count += validCombinations(start);
    }
  }

  memoize.set(design, count);
  return count;
};

const result = designs
  .map((d, i) => {
    return validCombinations(d);
  })
  .reduce((a, b) => a + b, 0);
assertResult(16, result);
