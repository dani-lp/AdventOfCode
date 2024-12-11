import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false });
console.clear();

const BLINKS = 75;
const FACTOR = 2024;

const splitIfEven = (stone: string): string | [string, string] => {
  if (stone.length % 2 !== 0) {
    return stone;
  }

  const firstStoneStr = stone.slice(0, stone.length / 2);
  const secondStoneStr = stone.slice(stone.length / 2, stone.length);

  return [Number(firstStoneStr).toString(), Number(secondStoneStr).toString()];
};

type NewStone = string | [string, string];

const getNewStone = (stone: string): NewStone => {
  if (stone === "0") {
    return "1";
  }
  if (stone.length % 2 === 0) {
    return splitIfEven(stone);
  }
  return (Number(stone) * FACTOR).toString();
};

const stoneMap = new Map<string, number>();
input.split(" ").forEach((stone) => stoneMap.set(stone, 1));

const addStone = (stone: string, times: number) => {
  const existingCount = stoneMap.get(stone);
  if (existingCount) {
    stoneMap.set(stone, existingCount + times);
  } else {
    stoneMap.set(stone, times);
  }
};

for (let i = 0; i < BLINKS; i++) {
  const _stoneMap = new Map(stoneMap);

  Array.from(_stoneMap.keys()).forEach((stone) => {
    const baseStoneCount = _stoneMap.get(stone) ?? 0;
    const stoneCount = _stoneMap.get(stone) ?? 1;

    const nextStones = getNewStone(stone);
    if (typeof nextStones === "string") {
      addStone(nextStones, stoneCount);
    } else {
      const [stone1, stone2] = nextStones;
      addStone(stone1, stoneCount);
      addStone(stone2, stoneCount);
    }

    const newStoneCount = stoneMap.get(stone)!;
    stoneMap.set(stone, newStoneCount - baseStoneCount);
  });
}

const result = Array.from(stoneMap.values()).reduce((a, b) => a + b, 0);
assertResult(55312, result);
