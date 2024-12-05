import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false });
console.clear();

const [rulesInput, updatesInput] = input
  .split("\n\n")
  .map((el) => el.split("\n"));
const rules = rulesInput.map((rule) => rule.split("|"));
const updates = updatesInput.map((update) => update.split(","));

const isUpdateValid = (update: string[]): boolean => {
  for (let i = 0; i < rules.length; i++) {
    const [before, after] = rules[i];
    const beforeIndex = update.indexOf(before);
    const afterIndex = update.indexOf(after);

    if (beforeIndex < 0 || afterIndex < 0) continue;
    if (beforeIndex > afterIndex) return false;
  }
  return true;
};

const result = updates
  .filter(isUpdateValid)
  .map((update) => update[Math.floor(update.length / 2)])
  .map(Number)
  .reduce((a, b) => a + b, 0);

assertResult(143, result);
