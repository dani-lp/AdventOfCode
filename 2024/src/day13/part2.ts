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

const CONVERSION_FACTOR = 10000000000000;

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
    prize: {
      x: Number(px) + CONVERSION_FACTOR,
      y: Number(py) + CONVERSION_FACTOR,
    },
  };
});

const solveXYSystem = (
  x: number,
  ax: number,
  bx: number,
  y: number,
  ay: number,
  by: number,
): [number, number] | null => {
  try {
    // Calculate determinant
    const det = ax * by - ay * bx;

    // Check if determinant is effectively zero
    if (Math.abs(det) < 1e-10) {
      return null;
    }

    // Solve for X and Y
    const X = (by * x - bx * y) / det;
    const Y = (ax * y - ay * x) / det;

    // Check if solutions are non-negative
    return X >= 0 && Y >= 0 && Number.isInteger(X) && Number.isInteger(Y)
      ? [X, Y]
      : null;
  } catch (error) {
    console.error(`Error solving system: ${error}`);
    return null;
  }
};

const computeMachineMinPrize = (machine: Machine): number => {
  const result = solveXYSystem(
    machine.prize.x,
    machine.buttonA.x,
    machine.buttonB.x,
    machine.prize.y,
    machine.buttonA.y,
    machine.buttonB.y,
  );

  if (!result) return 0;

  const [a, b] = result;
  return a * Prices.ButtonA + b * Prices.ButtonB;
};

const result = machines.map(computeMachineMinPrize).reduce((a, b) => a + b, 0);
assertResult(480, result);

// 2833300675779442700 too high
