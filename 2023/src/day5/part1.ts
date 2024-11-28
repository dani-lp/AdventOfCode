import { assertResult, readInput } from "../utils";

const rawInput = readInput({ test: false, clear: true, split: false });
const input = rawInput.split("\n\n");

// parsing
const [rawSeeds, ...rawMaps] = input;
const seeds =
  rawSeeds
    ?.split(": ")[1]
    ?.split(" ")
    .map((num) => Number(num)) ?? [];
const maps = rawMaps.map((map) =>
  map
    .split("\n")
    .slice(1)
    .map(
      (line) =>
        line.split(" ").map((num) => Number(num)) as [number, number, number],
    ),
);

const locations: Array<number> = seeds.map((seed) => {
  let accumulator = seed;
  maps.forEach((map) => {
    let ignore = false;
    map.forEach(([destination, source, length]) => {
      const [startMin, startMax] = [source, source + length];
      if (accumulator < startMin || accumulator > startMax) {
        return;
      }
      const conversionIndex = accumulator - source;
      const newAccumulator = destination + conversionIndex;
      if (newAccumulator && !ignore) {
        accumulator = newAccumulator;
        ignore = true;
      }
    });
  });
  return accumulator;
});

const result = Math.min(...locations);
assertResult(35, result);
