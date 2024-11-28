import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true });
const grid = input.map((line) => line.split(""));

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
let result = 0;

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < (grid[y]?.length ?? 0); x++) {
    const element = grid[x]?.[y];

    if (element === "*") {
      const adjacentCoordinates: Array<Coordinate> = [
        { x: x - 1, y: y - 1 },
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y },
        { x: x + 1, y: y + 1 },
      ];

      const adjacentPartNumbers = gridNumbers.filter((gridNumber) => {
        // return if ANY of the gridNumber coordinates is one of the adjacentCoordinates
        return gridNumber.coordinates.some(({ x: numberX, y: numberY }) =>
          adjacentCoordinates.some(
            ({ x, y }) => numberX === x && numberY === y,
          ),
        );
      });

      if (adjacentPartNumbers.length === 2) {
        result += adjacentPartNumbers
          .map((number) => number.value)
          .reduce((a, b) => a * b, 1);
      }
    }
  }
}

assertResult(467835, result);
