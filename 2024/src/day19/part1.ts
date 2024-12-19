import { assertResult, readInput } from "../utils";

const [patternsInput, designsInput] = readInput({
  test: false,
  split: false,
}).split("\n\n");
console.clear();

const patterns = patternsInput.split(", ");
const designs = designsInput.split("\n");

const isDesignValid = (design: string): boolean => {
  let endSize = 1;

  while (true) {
    const start = design.slice(0, design.length - endSize);
    const end = design.slice(design.length - endSize);

    if (!start.length) return patterns.includes(end);

    if (patterns.includes(end) && isDesignValid(start)) {
      return true;
    }
    endSize++;
  }
};

const result = designs.filter(isDesignValid).length;
assertResult(6, result);
