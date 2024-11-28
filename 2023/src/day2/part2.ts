import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true });

// types
type Color = "red" | "green" | "blue";

// parsing
const games = input.map((line) => {
  const [_, rawCubeSets] = line.split(":");

  const baseCubeSets = rawCubeSets?.split(";").map((set) => set.trim()) ?? [];

  const gameMaxes: Record<Color, number> = {
    red: 0,
    green: 0,
    blue: 0,
  };

  baseCubeSets.forEach((cubeSet) =>
    // these can only contain 1 occurence of each color at max,
    // e.g. "1 red, 2 green, 6 blue"
    cubeSet
      .split(",")
      .map((set) => set.trim())
      .map((set) => set.split(" "))
      .forEach((splitSet) => {
        const [amountStr, color] = splitSet as [string, Color];

        const amount = Number(amountStr);

        if (gameMaxes[color] < amount) {
          gameMaxes[color] = amount;
        }
      }),
  );

  return Object.values(gameMaxes).reduce((a, b) => a * b, 1);
});

// result
const result = games.reduce((a, b) => a + b, 0);

assertResult(2286, result);
