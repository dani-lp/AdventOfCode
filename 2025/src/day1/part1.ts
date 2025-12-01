import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true });
const movements = input.map((row) => {
  const direction = row[0];
  const distance = Number(row.slice(1)) % 100;
  return { direction: direction as "L" | "R", distance };
});

let position = 50;
let zeroes = 0;
movements.forEach(({ direction, distance }) => {
  if (direction === "L") {
    const newPosition = position - distance;
    if (newPosition < 0) {
      position = 100 - Math.abs(newPosition);
    } else {
      position = newPosition;
    }
  } else {
    const newPosition = position + distance;
    if (newPosition > 99) {
      position = newPosition - 100;
    } else {
      position = newPosition;
    }
  }

  if (position === 0) {
    zeroes++;
  }
});

assertResult(3, zeroes);
