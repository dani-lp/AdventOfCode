import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: true });

const range = (from: number, length: number) =>
  Array.from({ length }, (_, i) => i + from);

type Options = {
  [holdTime: number]: number;
};

type Race = {
  time: number;
  distance: number;
  options: Options;
};

// parsing
const [rawTime, rawDistance] = input as [string, string];
const [, times] = rawTime.split(":").map((chunk) =>
  chunk
    .split(" ")
    .filter((chunk) => chunk !== "")
    .map(Number),
) as [number[], number[]];
const [, distances] = rawDistance.split(":").map((chunk) =>
  chunk
    .split(" ")
    .filter((chunk) => chunk !== "")
    .map(Number),
) as [number[], number[]];

const races: Array<Race> = times?.map((time, index) => {
  const distance = distances[index] ?? 0;
  const options = range(1, time).reduce<Options>((current, holdingTime) => {
    current[holdingTime] = holdingTime * (time - holdingTime);
    return current;
  }, {});

  return {
    distance,
    time,
    options,
  };
});

const result = races
  .map(
    (race) =>
      Object.values(race.options).filter((distance) => distance > race.distance)
        .length,
  )
  .reduce((a, b) => a * b, 1);
assertResult(288, result);
