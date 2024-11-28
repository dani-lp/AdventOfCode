import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: false });

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type Condition = {
  category: keyof Part;
  comparison: ">" | "<";
  value: number;
};

type Rule = {
  destination: string; // always present
  condition: Condition | null;
};

type Workflow = {
  name: string;
  rules: Rule[];
};

const [workflowsArr] = input
  .split("\n\n")
  .map((section) => section.split("\n"));

const workflows: Workflow[] = workflowsArr.map((workflowStr) => {
  const [name, rawRules] = workflowStr.split("{");
  const splitRules = rawRules.substring(0, rawRules.length - 1).split(",");
  const rules: Rule[] = splitRules.map((ruleStr) => {
    const [condition, destination] = ruleStr.split(":");
    const [category, value] = condition.includes("<")
      ? condition.split("<")
      : condition.split(">");

    return {
      destination: ruleStr.includes(":") ? destination : condition,
      condition: ruleStr.includes(":")
        ? {
            category: category as keyof Part,
            comparison: condition.includes("<") ? "<" : ">",
            value: Number(value),
          }
        : null,
    } satisfies Rule;
  });

  return {
    name,
    rules,
  };
});

const INITIAL_WORKFLOW_NAME = "in";

// Idea for the solution:
// For each possible destination, backtrack completion until "in"'s
// first condition is reached, and calculate the numeric conditions for
// each path

const copyWorkflows = (workflows: Workflow[]) =>
  workflows.map((w) => ({
    name: w.name,
    rules: w.rules.map((rule) => ({
      destination: rule.destination,
      condition: rule.condition
        ? {
            category: rule.condition.category,
            comparison: rule.condition.comparison,
            value: rule.condition.value,
          }
        : null,
    })),
  }));

// Get the initial paths to check
const acceptedWorkflows = copyWorkflows(workflows).filter((workflow) =>
  workflow.rules.some((rule) => rule.destination === "A"),
);
const workflowsToCheck: Workflow[] = [];
acceptedWorkflows.forEach((workflow) => {
  const reversedRules = [...workflow.rules].reverse();

  for (let i = 0; i < reversedRules.length; i++) {
    const rule = reversedRules[i];
    if (rule.destination !== "A") continue;
    const newRules = reversedRules.slice(i);
    workflowsToCheck.push({ ...workflow, rules: newRules });
  }
});

// ALGORITHM
// Condition: store all conditions that must be followed to reach an accepted destination
// For each workflow that can reach a destination, apply algorithm to every A-destiny option
// 1.- Take the first rule
//    1.1.- If the rule HAS a condition, add it to the rule stack
// 2.- Check if there are more rules in the workflow
//    2.1.- If THERE ARE more rules, add its opposing condition to the rule stack
// 3.- Check if the current workflow is final
//    3.1.- If the workflow IS final, add the rule stack to the global list of stacks => BREAK
//    3.2.- If the workflow IS NOT final, set the next workflow to the one that points to the current workflow

const allConditionStacks: Condition[][] = copyWorkflows(workflowsToCheck).map(
  (workflow, i) => {
    const ruleStack: Condition[] = [];

    let currentWorkflow = workflow;
    while (true) {
      // 1.
      const firstRule = currentWorkflow.rules.shift();
      // 1.1
      if (firstRule?.condition) {
        ruleStack.push(firstRule.condition);
      }
      // 2
      let nextRule = currentWorkflow.rules.shift();
      while (nextRule?.condition) {
        const { category, comparison, value } = nextRule.condition;
        // 2.2
        const opposingRule: Condition = {
          category,
          comparison: comparison === "<" ? ">" : "<",
          value: comparison === "<" ? value - 1 : value + 1,
        };
        ruleStack.push(opposingRule);
        nextRule = currentWorkflow.rules.shift();
      }
      // 3
      if (currentWorkflow.name === INITIAL_WORKFLOW_NAME) {
        return ruleStack;
      } else {
        const newWorkflow = copyWorkflows(workflows).find((w) =>
          w.rules.some((rule) => rule.destination === currentWorkflow.name),
        );
        if (!newWorkflow) {
          throw new Error("Oopsies");
        }
        // reduce and reverse the rules of the workflow
        newWorkflow.rules.reverse();
        const indexOfFirstRule = newWorkflow.rules.findIndex(
          (rule) => rule.destination === currentWorkflow.name,
        );
        newWorkflow.rules = newWorkflow.rules.slice(indexOfFirstRule);
        currentWorkflow = newWorkflow;
      }
    }
  },
);

type Range = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
};
const valueRanges: Range[] = allConditionStacks.map((conditions) => {
  const baseRange: Range = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };

  conditions.forEach(({ category, comparison, value }) => {
    if (comparison === "<") {
      if (baseRange[category][1] >= value) {
        baseRange[category][1] = value - 1;
      }
    } else {
      if (baseRange[category][0] <= value) {
        baseRange[category][0] = value + 1;
      }
    }
  });

  return baseRange;
});

const computeTotalCombinations = (range: Range): number => {
  const combinationsX = range.x[1] - range.x[0] + 1;
  const combinationsM = range.m[1] - range.m[0] + 1;
  const combinationsA = range.a[1] - range.a[0] + 1;
  const combinationsS = range.s[1] - range.s[0] + 1;

  return combinationsX * combinationsM * combinationsA * combinationsS;
};

const result = valueRanges
  .map(computeTotalCombinations)
  .reduce((a, b) => a + b, 0);
assertResult(167_409_079_868_000, result);
