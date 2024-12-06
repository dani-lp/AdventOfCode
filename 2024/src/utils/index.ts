import fs from "fs";

type ReadInputParams = {
  test?: boolean;
  split?: boolean;
  clear?: boolean;
};

export const readInput = <T extends ReadInputParams>(opts: T) => {
  const TEST_INPUT_FILENAME = "./testinput.txt";
  const INPUT_FILENAME = "./input.txt";

  if (opts.clear) {
    console.clear();
  }

  const filename = opts.test ? TEST_INPUT_FILENAME : INPUT_FILENAME;

  const rawInput = fs.readFileSync(filename, { encoding: "utf8", flag: "r" });

  return opts.split
    ? (rawInput.split("\n") as T["split"] extends true ? string[] : string)
    : (rawInput as T["split"] extends true ? string[] : string);
};

export const assertResult = (expected: any, actual: any) =>
  console.assert(
    expected === actual,
    `\nExpected: ${expected}\nActual: ${actual}`,
  );

export const zip = <T extends any[]>(
  ...arrays: { [K in keyof T]: T[K][] }
): { [K in keyof T]: T[K] }[] => {
  const minLength = Math.min(...arrays.map((arr) => arr.length));
  return Array.from(
    { length: minLength },
    (_, i) => arrays.map((arr) => arr[i]) as { [K in keyof T]: T[K] },
  );
};

export const printGrid = (grid: string[][]) => {
  grid.forEach((row) => console.log(row.join("")));
};
