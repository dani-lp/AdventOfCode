import { assertResult, readInput } from "../utils";

const rows = readInput({ test: false, split: true });
console.clear();

const countMatches = (input: Readonly<string>): number => {
  const regex = /XMAS/g;
  let matches = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    matches++;
  }
  return matches;
};

// horizontals
const allRows: string[] = [];
rows.forEach((row) => {
  allRows.push(row);
  allRows.push(row.split("").toReversed().join(""));
});

// verticals
const columns = Array.from({ length: rows[0].length }, (_, i) =>
  rows.map((row) => row[i]).join(""),
);
columns.forEach((col) => {
  allRows.push(col);
  allRows.push(col.split("").toReversed().join(""));
});

// diagonals
for (let row = 3; row < rows.length; row++) {
  const diag1: string[] = [];
  for (let i = 0, j = row; i <= row && j >= 0; i++, j--) {
    diag1.push(rows[j].at(i)!);
  }
  allRows.push(diag1.join(""));
  allRows.push(diag1.toReversed().join(""));

  const diag2: string[] = [];
  for (let i = rows[row].length - 1, j = row; i >= 0 && j >= 0; i--, j--) {
    diag2.push(rows[j].at(i)!);
  }
  allRows.push(diag2.join(""));
  allRows.push(diag2.toReversed().join(""));
}

for (let column = 1; column < rows[0].length - 3; column++) {
  const diag1: string[] = [];
  for (
    let i = column, j = rows.length - 1;
    i <= rows[0].length && j >= 0;
    i++, j--
  ) {
    diag1.push(rows[j].at(i)!);
  }
  allRows.push(diag1.join(""));
  allRows.push(diag1.toReversed().join(""));

  const diag2: string[] = [];
  for (
    let i = rows.length - column - 1, j = rows.length - 1;
    i >= 0 && j >= 0;
    i--, j--
  ) {
    diag2.push(rows[j].at(i)!);
  }
  allRows.push(diag2.join(""));
  allRows.push(diag2.toReversed().join(""));
}

const result = allRows.map(countMatches).reduce((a, b) => a + b, 0);
assertResult(18, result);
