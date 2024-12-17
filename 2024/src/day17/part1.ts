import { readInput } from "../utils";

const [registersInput, programInput] = readInput({
  test: false,
  split: false,
}).split("\n\n");
console.clear();

let [A, B, C] = registersInput
  .split("\n")
  .map((register) => Number(register.substring(11)));
const program = programInput.substring(9).split(",").map(Number);

let ip = 0;
let output = "";
const DEBUG = false;

const getComboValue = (op: number): number => {
  if ([0, 1, 2, 3].includes(op)) {
    return op;
  } else if (op === 4) {
    return A;
  } else if (op === 5) {
    return B;
  } else if (op === 6) {
    return C;
  } else {
    throw new Error("Invalid combo op");
  }
};

// opcode 0
const adv = (op: number): void => {
  DEBUG && console.log("adv");
  const comboValue = getComboValue(op);
  const result = A / 2 ** comboValue;
  A = Math.floor(result);
};

// opcode 1
const bxl = (op: number): void => {
  DEBUG && console.log("bxl");
  B = B ^ op;
};

// opcode 2
const bst = (op: number): void => {
  DEBUG && console.log("bst");
  B = getComboValue(op) % 8;
};

// opcode 3
const jnz = (op: number): boolean => {
  DEBUG && console.log("jnz");
  if (A === 0) return false;
  ip = op;
  return true;
};

// opcode 4
const bxc = (_: number): void => {
  DEBUG && console.log("bxc");
  B = B ^ C;
};

// opcode 5
const out = (op: number): void => {
  DEBUG && console.log("out");
  const comboOp = getComboValue(op);
  const result = comboOp % 8;

  if (output.length) {
    output += `,${result}`;
  } else {
    output += result;
  }
};

// opcode 6
const bdv = (op: number): void => {
  DEBUG && console.log("bdv");
  const comboValue = getComboValue(op);
  const result = A / 2 ** comboValue;
  B = Math.floor(result);
};

// opcode 7
const cdv = (op: number): void => {
  DEBUG && console.log("cdv");
  const comboValue = getComboValue(op);
  const result = A / 2 ** comboValue;
  C = Math.floor(result);
};

const instructions: Record<number, (op: number) => void | boolean> = {
  0: adv,
  1: bxl,
  2: bst,
  3: jnz,
  4: bxc,
  5: out,
  6: bdv,
  7: cdv,
};

const callInstruction = (
  instructionCode: number,
  op: number,
): void | boolean => {
  const func = instructions[instructionCode];

  if (!func) {
    throw new Error("Invalid instruction code");
  }

  return func(op);
};

while (program[ip] !== undefined) {
  const instruction = program[ip];
  const op = program[ip + 1];

  if (instruction === undefined || op === undefined) {
    break;
  }

  const shouldSkipJump = callInstruction(instruction, op);
  if (!shouldSkipJump) {
    ip += 2;
  }
}

console.log(output);
console.log({ A, B, C });
