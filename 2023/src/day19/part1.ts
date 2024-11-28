import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: false });

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type Rule = {
  destination: string; // always present
  condition: {
    category: keyof Part;
    comparison: ">" | "<";
    value: number;
  } | null;
};

type Workflow = {
  name: string;
  rules: Rule[];
};

const [workflowsArr, partsArr] = input
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

const parts: Part[] = partsArr.map((partStr) => {
  const [x, m, a, s] = partStr
    .substring(1, partStr.length - 1)
    .split(",")
    .map((category) => Number(category.split("=")[1]));
  return { x, m, a, s };
});

const INITIAL_WORKFLOW_NAME = "in";

const result = parts
  .map((part) => {
    let currentWorkflow = workflows.find(
      (workflow) => workflow.name === INITIAL_WORKFLOW_NAME,
    );
    while (currentWorkflow) {
      for (let i = 0; i < currentWorkflow.rules.length; i++) {
        const rule = currentWorkflow.rules[i];
        if (rule.condition) {
          const { category, comparison, value } = rule.condition;
          if (
            (comparison === "<" && part[category] < value) ||
            (comparison === ">" && part[category] > value)
          ) {
            if (rule.destination === "A")
              return Object.values(part).reduce((a, b) => a + b, 0);
            if (rule.destination === "R") return 0;
            currentWorkflow = workflows.find(
              (workflow) => workflow.name === rule.destination,
            );
            break;
          }
        } else {
          if (rule.destination === "A")
            return Object.values(part).reduce((a, b) => a + b, 0);
          if (rule.destination === "R") return 0;
          currentWorkflow = workflows.find(
            (workflow) => workflow.name === rule.destination,
          );
          break;
        }
      }
    }
    return 0;
  })
  .reduce((a, b) => a + b, 0);
assertResult(19114, result);
