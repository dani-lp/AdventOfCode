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
const [, allTimes] = rawTime.split(":").map((chunk) =>
  chunk
    .split(" ")
    .filter((chunk) => chunk !== "")
    .map(Number),
) as [number[], number[]];
const [, allDistances] = rawDistance.split(":").map((chunk) =>
  chunk
    .split(" ")
    .filter((chunk) => chunk !== "")
    .map(Number),
) as [number[], number[]];

const time = Number(allTimes.join(""));
const distance = Number(allDistances.join(""));

const options = range(1, time).reduce<Options>((current, holdingTime) => {
  current[holdingTime] = holdingTime * (time - holdingTime);
  return current;
}, {});

const race: Race = {
  distance,
  time,
  options,
};

const result = Object.values(race.options).filter(
  (distance) => distance > race.distance,
).length;
assertResult(71503, result);
