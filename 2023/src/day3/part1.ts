import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true });
const grid = input.map((line) => line.split(""));

const PERIOD = ".";

// types
type Coordinate = {
  x: number;
  y: number;
};

type GridNumber = {
  value: number;
  coordinates: Array<Coordinate>;
};

// utils
const isSymbol = (char: string) => {
  return char !== PERIOD && isNaN(Number(char));
};

const isNumber = (char: string) => {
  return !isNaN(Number(char));
};

// parsing
const gridNumbers: Array<GridNumber> = [];

input.forEach((line, rowIndex) => {
  let lineIndex = 0;
  let offsetIndex = 0;

  while (lineIndex < line.length && offsetIndex < line.length) {
    const char = line.charAt(lineIndex);

    if (isNumber(char)) {
      offsetIndex = lineIndex;
      while (offsetIndex <= line.length) {
        offsetIndex += 1;
        const offsetChar = line.charAt(offsetIndex);

        if (!isNumber(offsetChar) || offsetChar === "") {
          // store the found number
          const number = line.substring(lineIndex, offsetIndex);
          const coordinates: Array<Coordinate> = [];
          for (let y = lineIndex; y < offsetIndex; y++) {
            coordinates.push({
              x: rowIndex,
              y,
            });
          }

          const numberObj: GridNumber = {
            value: Number(number),
            coordinates,
          };
          gridNumbers.push(numberObj);
          lineIndex = offsetIndex;
          break;
        }
      }
    } else {
      lineIndex++;
    }
  }
});

// solution
const result = gridNumbers
  .map(({ value, coordinates }) => {
    const valid =
      coordinates
        .map(({ x, y }) => {
          const neighbors = [
            grid[x - 1]?.[y - 1],
            grid[x - 1]?.[y],
            grid[x - 1]?.[y + 1],
            grid[x]?.[y - 1],
            grid[x]?.[y],
            grid[x]?.[y + 1],
            grid[x + 1]?.[y - 1],
            grid[x + 1]?.[y],
            grid[x + 1]?.[y + 1],
          ].filter(Boolean) as Array<string>;

          return neighbors.some(isSymbol);
        })
        .filter(Boolean).length > 0;

    // console.log(`${value}: ${valid ? "valid" : "NOT VALID"}`);

    return valid ? value : 0;
  })
  .reduce((a, b) => a + b, 0);

assertResult(4361, result);
