import { assertResult, range, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true });
const movements = input.map((row) => {
  const direction = row[0];
  const distance = Number(row.slice(1));
  return { direction: direction as "L" | "R", distance };
});

let position = 50;
let zeroes = 0;

movements.forEach(({ direction, distance }) => {
  if (direction === "L") {
    const newPosition = position - distance;
    const passRange = range(position, newPosition);
    zeroes += passRange.filter((num) => Math.abs(num) % 100 === 0).length;

    if (newPosition < 0) {
      position = 100 - Math.abs(newPosition % 100);
      if (position === 100) {
        position = 0;
      }
    } else {
      position = newPosition;
    }
  } else {
    const newPosition = position + distance;
    const passRange = range(position, newPosition);
    zeroes += passRange.filter((num) => num % 100 === 0).length;

    if (newPosition > 99) {
      position = newPosition % 100;
      if (position === 100) {
        position = 0;
      }
    } else {
      position = newPosition;
    }
  }
});

assertResult(6, zeroes);
