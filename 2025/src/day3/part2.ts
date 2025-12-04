import { assertResult, readInput } from "../utils";

const getMaxNumberScore = (
  row: string,
  targetLength: number,
  score: string = ""
): string => {
  if (targetLength === 1) {
    const maxVoltageChar = Math.max(...row.split("").map(Number)).toString();
    return `${score}${maxVoltageChar}`;
  }

  const reducedRow = row.slice(0, row.length - targetLength + 1);
  let newMax = -1;
  let newMaxPosition = -1;
  for (let i = 0; i < reducedRow.length; i++) {
    const currentVoltage = Number(reducedRow[i]);
    if (currentVoltage > newMax) {
      newMax = currentVoltage;
      newMaxPosition = i;
    }
  }

  if (newMax < 0 || newMaxPosition < 0) {
    throw new Error("No max detected");
  }

  const newRowToInspect = row.slice(newMaxPosition + 1);
  return getMaxNumberScore(
    newRowToInspect,
    targetLength - 1,
    `${score}${newMax}`
  );
};

const input = readInput({ test: false, split: true, clear: true })
  .map((row) => {
    return getMaxNumberScore(row, 12);
  })
  .map(Number)
  .reduce((a, b) => a + b, 0);

assertResult(3121910778619, input);
