import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false }).split("\n\n");
console.clear();

type Position = {
  x: number;
  y: number;
};

type Machine = {
  buttonA: Position;
  buttonB: Position;
  prize: Position;
};

const Prices = {
  ButtonA: 3,
  ButtonB: 1,
} as const;

const machines: Machine[] = input.map((row) => {
  const [a, b, prize] = row.split("\n").map((r) =>
    r
      .split(": ")[1]
      .split(", ")
      .map((c) => c.slice(2)),
  );

  const [ax, ay] = a;
  const [bx, by] = b;
  const [px, py] = prize;

  return {
    buttonA: { x: Number(ax), y: Number(ay) },
    buttonB: { x: Number(bx), y: Number(by) },
    prize: { x: Number(px), y: Number(py) },
  };
});

const MAX_PRESSES = 100;
const computeMachineMinPrize = (machine: Machine): number => {
  let minimum = Number.POSITIVE_INFINITY;
  for (let aPresses = 0; aPresses < MAX_PRESSES; aPresses++) {
    for (let bPresses = 0; bPresses < MAX_PRESSES; bPresses++) {
      const finalX =
        machine.buttonA.x * aPresses + machine.buttonB.x * bPresses;
      const finalY =
        machine.buttonA.y * aPresses + machine.buttonB.y * bPresses;

      if (!(finalX === machine.prize.x && finalY === machine.prize.y)) {
        continue;
      }

      const finalPrice = Prices.ButtonA * aPresses + Prices.ButtonB * bPresses;
      if (finalPrice < minimum) {
        minimum = finalPrice;
      }
    }
  }

  if (minimum === Number.POSITIVE_INFINITY) return 0;
  return minimum;
};

const result = machines.map(computeMachineMinPrize).reduce((a, b) => a + b, 0);
assertResult(480, result);
