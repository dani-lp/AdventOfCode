import { assertResult, readInput } from "../utils";

const removeDots = (inputString: string) => {
  // Remove dots from the beginning of the string
  let startIndex = 0;
  while (startIndex < inputString.length && inputString[startIndex] === ".") {
    startIndex++;
  }

  // Remove dots from the end of the string
  let endIndex = inputString.length - 1;
  while (endIndex >= 0 && inputString[endIndex] === ".") {
    endIndex--;
  }

  // Extract the substring without leading and trailing dots
  const result = inputString.substring(startIndex, endIndex + 1);
  return result;
};

const input = readInput({ test: false, clear: true, split: true }).map(
  (row) => ({
    springs: removeDots(row.split(" ")[0]!),
    sizes: row
      .split(" ")[1]
      ?.split(",")
      .map((num) => Number(num))!,
  }),
);

const generateRegex = (numbers: number[]) => {
  const regexString = `^\\.*${numbers
    .map((num) => `#${"{" + num + "}"}`)
    .join("\\.+")}\\.*$`;
  return new RegExp(regexString);
};

/**
 * Get the count of "?" characters in a string.
 */
const getUnknownCount = (springs: string) => springs.match(/\?/g)?.length ?? 0;

/**
 * Check if a given complete string is a valid.
 */
const isCombinationValid = (springs: string, numbers: number[]): boolean => {
  if (getUnknownCount(springs) > 0) return false;
  const regex = generateRegex(numbers);
  return regex.test(springs);
};

const memoization: Map<string, number> = new Map();

const iDoNotKnowHowToDoThis = (
  springs: string,
  sizes: number[],
  baseValidCombinations: number,
): number => {
  const key = JSON.stringify({ springs, sizes, baseValidCombinations });

  const memoizedValue = memoization.get(key);
  if (memoizedValue !== undefined) {
    return memoizedValue;
  }

  // BASE CASES:
  // 1. No more sizes =>
  //    1. If empty string, GOOD
  //    2. If none, BAD
  // 2. No more springs && more sizes => BAD

  if (getUnknownCount(springs) === 0) {
    const result = isCombinationValid(springs, sizes)
      ? baseValidCombinations + 1
      : baseValidCombinations;
    memoization.set(key, result);
    return result;
  }

  let validCombinations = baseValidCombinations;

  // 1. First element === '.' => remove dots and continue
  if (springs.charAt(0) === ".") {
    validCombinations += iDoNotKnowHowToDoThis(
      removeDots(springs),
      sizes,
      baseValidCombinations,
    );
  }
  // 2. First element === '#' => COMPLEX STUFF
  else if (springs.charAt(0) === "#") {
    // 1. First size === 1 => COMPLEX STUFF
    if (sizes[0] === 1) {
      // 1. Next element === '.' => remove size, remove first char, remove dots
      if (springs.charAt(1) === ".") {
        validCombinations += iDoNotKnowHowToDoThis(
          removeDots(springs.replace("#", ".")),
          sizes.slice(1),
          validCombinations,
        );
      }
      // 2. Next element === '#' => BAD
      else if (springs.charAt(1) === "#") {
        memoization.set(key, validCombinations);
        return validCombinations;
      }
      // 3. Next element === '?' => remove size, replace ? by '.', remove dots
      else if (springs.charAt(1) === "?") {
        validCombinations += iDoNotKnowHowToDoThis(
          removeDots(springs.replace("#", ".")).replace("?", "."),
          sizes.slice(1, sizes.length),
          validCombinations,
        );
      }
    }
    // 2. First size  >  1 => COMPLEX STUFF (+ first char === '#')
    else if (sizes[0] && sizes[0] > 1) {
      // 1. Next element === '.' => BAD
      if (springs.charAt(1) === ".") {
        memoization.set(key, validCombinations);
        return validCombinations; // TODO rethink return value
      }
      // 2. Next element === '#' => remove first 1, decrease sizes[0] by 1
      else if (springs.charAt(1) === "#") {
        validCombinations += iDoNotKnowHowToDoThis(
          springs.substring(1),
          sizes.map((value, index) => (index === 0 ? value - 1 : value)),
          validCombinations,
        );
      }
      // 3. Next element === '?' => remove first 1, replace first ? by #, decrease sizes[0] by 1, process again
      else if (springs.charAt(1) === "?") {
        validCombinations += iDoNotKnowHowToDoThis(
          springs.substring(1).replace("?", "#"),
          sizes.map((value, index) => (index === 0 ? value - 1 : value)),
          validCombinations,
        );
      }
    }
  }
  // 3. First element === '?' => compute for both options
  else if (springs.charAt(0) === "?") {
    const withDotCombinations = iDoNotKnowHowToDoThis(
      removeDots(springs.replace("?", ".")),
      sizes,
      baseValidCombinations,
    );
    const withHashCombinations = iDoNotKnowHowToDoThis(
      springs.replace("?", "#"),
      sizes,
      baseValidCombinations,
    );

    validCombinations += withDotCombinations + withHashCombinations;
  }

  memoization.set(key, validCombinations);
  return validCombinations;
};

const result = input
  .map(({ springs, sizes }) => iDoNotKnowHowToDoThis(springs, sizes, 0))
  .reduce((a, b) => a + b, 0);
assertResult(525152, result);
