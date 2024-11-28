import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: false }).split(",");

const hash = (code: string) =>
  code
    .split("")
    .reduce((acc, curr) => ((acc + curr.charCodeAt(0)) * 17) % 256, 0);

const result = input.map(hash).reduce((a, b) => a + b, 0);
assertResult(1320, result);
