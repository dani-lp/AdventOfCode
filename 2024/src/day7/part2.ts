import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const generateOperations = (valuesLength: number): Array<string> => {
  const n = valuesLength - 1;
  const operations: string[] = [];
  for (let i = 0; i < 1 << n; i++) {
    operations.push((i >>> 0).toString(2).padStart(n, "0"));
  }

  return operations.map((op) => op.replaceAll("0", "+").replaceAll("1", "*"));
};

const generateExtendedOperations = (valuesLength: number) => {
  const characters = ["+", "*", "#"];
  const result: string[] = [];

  // Recursive function to generate combinations
  const backtrack = (current: string, length: number) => {
    // If we've reached the desired length, add to results
    if (current.length === length) {
      result.push(current);
      return;
    }

    // Try adding each character
    for (const char of characters) {
      backtrack(current + char, length);
    }
  };

  // Start the backtracking process
  backtrack("", valuesLength - 1);

  return result;
};

const equations = input.map((row) => {
  const [total, values] = row.split(": ");

  return {
    total: Number(total),
    values: values.split(" ").map(Number),
  };
});

const validEquations = equations.filter((eq) => {
  const { total, values: _values } = eq;
  const operations = generateOperations(_values.length);

  let valid = false;
  operations.forEach((op) => {
    if (valid) return;
    const values = [..._values];

    let result = values.shift()!;
    const opArr = op.split("");
    while (opArr.length) {
      const operation = opArr.shift();
      const nextNum = values.shift()!;
      if (operation === "+") {
        result = result + nextNum;
      } else if (operation === "*") {
        result = result * nextNum;
      }
    }

    if (result === total) {
      valid = true;
    }
  });
  return valid;
});

const invalidEquations = equations.filter((eq) => {
  const { total, values: _values } = eq;
  const operations = generateOperations(_values.length);

  let valid = false;
  operations.forEach((op) => {
    if (valid) return;
    const values = [..._values];

    let result = values.shift()!;
    const opArr = op.split("");
    while (opArr.length) {
      const operation = opArr.shift();
      const nextNum = values.shift()!;
      if (operation === "+") {
        result = result + nextNum;
      } else if (operation === "*") {
        result = result * nextNum;
      }
    }

    if (result === total) {
      valid = true;
    }
  });
  return !valid;
});

const computeOpResult = (_opArr: readonly string[]): number => {
  const opArr = [..._opArr];

  let result = Number(opArr.shift()!);
  while (opArr.length) {
    const next = opArr.shift()!;
    if (next === "+") {
      const nextNum = Number(opArr.shift()!);
      result = result + nextNum;
    } else if (next === "*") {
      const nextNum = Number(opArr.shift()!);
      result = result * nextNum;
    } else if (next === "#") {
      const nextNum = Number(opArr.shift()!);
      result = Number(`${result}${nextNum}`);
    }
  }

  return result;
};

const result = invalidEquations
  .filter((eq, i) => {
    const { total, values: _values } = eq;
    const operations = generateExtendedOperations(_values.length);

    let valid = false;
    operations.forEach((op) => {
      if (valid) return;
      const values = [..._values];

      const opArr: string[] = [];
      for (let i = 0; i < values.length; i++) {
        const num = values[i];
        const opCode = op[i];
        opArr.push(num.toString());
        if (opCode) opArr.push(opCode);
      }

      const opResult = computeOpResult(opArr);
      if (opResult === total) {
        valid = true;
      }
    });
    return valid;
  })
  .map(({ total }) => total)
  .concat(validEquations.map(({ total }) => total))
  .reduce((a, b) => a + b, 0);

assertResult(11387, result);
