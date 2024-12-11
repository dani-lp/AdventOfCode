import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false });
console.clear();

const BLINKS = 25;
const FACTOR = 2024;

const splitIfEven = (stone: string): string | [string, string] => {
  if (stone.length % 2 !== 0) {
    return stone;
  }

  const firstStoneStr = stone.slice(0, stone.length / 2);
  const secondStoneStr = stone.slice(stone.length / 2, stone.length);

  return [Number(firstStoneStr).toString(), Number(secondStoneStr).toString()];
};

let stones = input.split(" ");
for (let i = 0; i < BLINKS; i++) {
  stones = stones.flatMap((stone) => {
    if (stone === "0") {
      return "1";
    }
    if (stone.length % 2 === 0) {
      return splitIfEven(stone);
    }
    return (Number(stone) * FACTOR).toString();
  });
}

const result = stones.length;
assertResult(55312, result);
