import { assertResult, range, readInput } from "../utils";

const input = readInput({ test: false, split: false, clear: true });
const repeats = input
  .split(",")
  .map((row) => row.split("-").map(Number))
  .flatMap(([a, b]) => range(a, b + 1))
  .map(String)
  .filter((str) => str.length % 2 === 0)
  .filter((str) => {
    const midPoint = str.length / 2;
    const f = str.slice(0, midPoint);
    const s = str.slice(midPoint);
    return f === s;
  })
  .map(Number)
  .reduce((a, b) => a + b, 0);

assertResult(1227775554, repeats);
