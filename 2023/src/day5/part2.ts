import { assertResult, readInput } from "../utils";

const rawInput = readInput({ test: false, clear: true, split: false });
const input = rawInput.split("\n\n");

// parsing
const [rawSeeds, ...rawMaps] = input;
const seedsBase =
  rawSeeds
    ?.split(": ")[1]
    ?.split(" ")
    .map((num) => Number(num)) ?? [];
const seeds: Array<[number, number]> = [];
for (let i = 0; i < seedsBase.length; i += 2) {
  seeds.push(seedsBase.slice(i, i + 2) as [number, number]);
}
const maps = rawMaps.map((map) =>
  map
    .split("\n")
    .slice(1)
    .map(
      (line) =>
        line.split(" ").map((num) => Number(num)) as [number, number, number],
    ),
);

const locationToSeed = (location: number): number => {
  let accumulator = location;
  [...maps].reverse().forEach((map) => {
    let ignore = false;
    map.forEach(([source, destination, length]) => {
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
};

const seedRanges = seeds.map(
  ([start, length]) => [start, start + length] as const,
);

let result: number | null = null;
let location = 0;

while (!result) {
  const potentialSeed = locationToSeed(location);
  if (
    seedRanges.some(
      ([start, end]) => potentialSeed >= start && potentialSeed <= end,
    )
  ) {
    result = location;
  }
  location++;
}

assertResult(46, result);
