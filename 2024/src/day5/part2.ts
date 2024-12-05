import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false });
console.clear();

const [rulesInput, updatesInput] = input
  .split("\n\n")
  .map((el) => el.split("\n"));
const rules = rulesInput.map((rule) => rule.split("|"));
const updates = updatesInput.map((update) => update.split(","));

const isRuleValid = (update: string[], rule: string[]): boolean => {
  const [before, after] = rule;
  const beforeIndex = update.indexOf(before);
  const afterIndex = update.indexOf(after);

  if (beforeIndex < 0 || afterIndex < 0) return true;
  if (beforeIndex > afterIndex) return false;
  return true;
};

const isUpdateValid = (update: string[]): boolean => {
  for (let i = 0; i < rules.length; i++) {
    if (!isRuleValid(update, rules[i])) return false;
  }
  return true;
};

const result = updates
  .filter((u) => !isUpdateValid(u))
  .map((u) => {
    let update = u.slice();
    while (!isUpdateValid(update)) {
      const invalidRules = rules
        .filter(
          ([before, after]) =>
            update.includes(before) && update.includes(after),
        )
        .filter((rule) => !isRuleValid(update, rule));
      const [before, after] = invalidRules[0];
      const beforeIndex = update.indexOf(before);
      const afterIndex = update.indexOf(after);
      const temp = update[beforeIndex];
      update[beforeIndex] = update[afterIndex];
      update[afterIndex] = temp;
    }
    return update;
  })
  .map((update) => update[Math.floor(update.length / 2)])
  .map(Number)
  .reduce((a, b) => a + b, 0);

assertResult(123, result);
