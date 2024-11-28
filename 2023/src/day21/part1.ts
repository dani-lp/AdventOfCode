import { assertResult, readInput } from "../utils";

const TEST = false;

const input = readInput({ test: TEST, split: true, clear: true }).map((row) =>
  row.split(""),
);

const printGarden = (garden: string[][]) =>
  console.log(garden.map((row) => row.join("")).join("\n"));

const rockRow = Array.from({ length: input[0].length + 2 }, () => "#");
const garden = [rockRow]
  .concat(input.map((row) => ["#"].concat(row).concat(["#"])))
  .concat([rockRow]);

type Position = {
  row: number;
  col: number;
};

const start: Position = {
  row: 0,
  col: 0,
};
for (let row = 1; row < garden.length - 1; row++) {
  for (let col = 1; col < garden[0].length - 1; col++) {
    if (garden[row][col] === "S") {
      start.row = row;
      start.col = col;
      garden[row][col] = ".";
      break;
    }
  }
}

const STEP_GOAL = TEST ? 6 : 64;

let positionsToTest = [start];
for (let _ = 0; _ < STEP_GOAL; _++) {
  let newPositionsToTest: Position[] = [];
  positionsToTest.forEach(({ row, col }) => {
    newPositionsToTest.push(
      ...[
        { row: row + 1, col },
        { row: row - 1, col },
        { row, col: col + 1 },
        { row, col: col - 1 },
      ]
        .filter(({ row, col }) => garden[row][col] === ".")
        .filter(
          ({ row, col }) =>
            !newPositionsToTest.some(
              (pos) => row === pos.row && col === pos.col,
            ),
        ),
    );
  });

  positionsToTest = newPositionsToTest;
}

const result = positionsToTest.length;
assertResult(16, result);
