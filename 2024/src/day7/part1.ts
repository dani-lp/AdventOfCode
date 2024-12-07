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

const equations = input.map((row) => {
  const [total, values] = row.split(": ");

  return {
    total: Number(total),
    values: values.split(" ").map(Number),
  };
});

const result = equations
  .filter((eq) => {
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
  })
  .map(({ total }) => total)
  .reduce((a, b) => a + b, 0);

assertResult(3749, result);
