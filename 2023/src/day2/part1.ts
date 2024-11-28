import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true });

// types
type Color = "red" | "green" | "blue";

const maxes: Record<Color, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

// parsing
const games = input.map((line) => {
  const [game, rawCubeSets] = line.split(":");

  const rawGameId = game?.split(" ")[1];
  const gameId = rawGameId ? Number(rawGameId) : 0;
  const baseCubeSets = rawCubeSets?.split(";").map((set) => set.trim()) ?? [];

  const anyInvalidCubeSet =
    baseCubeSets
      .map(
        (cubeSet) =>
          // these can only contain 1 occurence of each color at max,
          // e.g. "1 red, 2 green, 6 blue"
          cubeSet
            .split(",")
            .map((set) => set.trim())
            .map((set) => set.split(" "))
            .map((splitSet) => {
              const [amount, color] = splitSet as [string, Color];

              if (Number(amount) > maxes[color]) {
                return true;
              }

              return null;
            })
            .filter(Boolean).length > 0,
      )
      .filter(Boolean).length > 0;

  return {
    gameId,
    valid: !anyInvalidCubeSet,
  };
});

// result
const result = games
  .map(({ gameId, valid }) => (valid ? gameId : 0))
  .reduce((a, b) => a + b, 0);

assertResult(8, result);
