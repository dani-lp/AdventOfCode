// Today was too hard for me. I was able to implement the solution
// mainly thanks to this video: https://www.youtube.com/watch?v=2pDSooPLLkI

import { assertResult, readInput } from "../utils";

const layout = readInput({ test: true, clear: true, split: true }).map((row) =>
  row.split("").map((num) => Number(num)),
);

type QueueElement = [
  heatLoss: number,
  row: number,
  column: number,
  deltaRow: number,
  deltaColumn: number,
  steps: number,
];

const seen = new Set<string>();
const priorityQueue: QueueElement[] = [[0, 0, 0, 0, 0, 0]];

while (priorityQueue.length) {
  // pop element with least HL from the priority queue
  const [heatLoss, row, column, deltaRow, deltaColumn, steps] = priorityQueue
    .sort(([prevHL], [currentHL]) => currentHL - prevHL)
    .pop()!;

  if (row === layout.length - 1 && column === layout[0]!.length - 1) {
    assertResult(102, heatLoss);
    break;
  }

  // don't include heat loss to avoid getting into a loop
  const key = JSON.stringify([row, column, deltaRow, deltaColumn, steps]);

  if (seen.has(key)) {
    continue;
  }
  seen.add(key);

  if (steps < 3 && ![deltaRow, deltaColumn].every((n) => n === 0)) {
    // keep same direction
    const nextRow = row + deltaRow;
    const nextColumn = column + deltaColumn;
    if (
      nextRow >= 0 &&
      nextRow < layout.length &&
      nextColumn >= 0 &&
      nextColumn < layout[0]!.length
    ) {
      priorityQueue.push([
        heatLoss + layout[nextRow]![nextColumn]!,
        nextRow,
        nextColumn,
        deltaRow,
        deltaColumn,
        steps + 1,
      ]);
    }
  }

  // check the rest of the directions
  (
    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ] as const
  ).forEach(([nextDeltaRow, nextDeltaColumn]) => {
    if (
      JSON.stringify([nextDeltaRow, nextDeltaColumn]) !==
        JSON.stringify([deltaRow, deltaColumn]) &&
      JSON.stringify([nextDeltaRow, nextDeltaColumn]) !==
        JSON.stringify([-deltaRow, -deltaColumn])
    ) {
      const nextRow = row + nextDeltaRow;
      const nextColumn = column + nextDeltaColumn;
      if (
        nextRow >= 0 &&
        nextRow < layout.length &&
        nextColumn >= 0 &&
        nextColumn < layout[0]!.length
      ) {
        priorityQueue.push([
          heatLoss + layout[nextRow]![nextColumn]!,
          nextRow,
          nextColumn,
          nextDeltaRow,
          nextDeltaColumn,
          1,
        ]);
      }
    }
  });
}
