import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'}).trim();
const input = rawInput.split(',').map((line) => parseInt(line));

const TARGET_OUTPUT = 19690720;

function calculateOutput(noun: number, verb: number) {
  let pc = 0;
  let memory = [...input];

  memory[1] = noun;
  memory[2] = verb;

  while (pc < memory.length) {
    const r1Val = memory[pc + 1];
    const r2Val = memory[pc + 2];
    const r3Val = memory[pc + 3];

    switch (memory[pc]) {
      case 1:
        memory[r3Val] = memory[r1Val] + memory[r2Val];
        break;
      case 2:
        memory[r3Val] = memory[r1Val] * memory[r2Val];
        break;
      case 99:
        break;
    }
    pc += 4;
  }

  return memory[0];
}

function computeResult() {
  for (let noun = 0; noun < 10000; noun++) {
    for (let verb = 0; verb < 10000; verb++) {
      if (calculateOutput(noun, verb) === TARGET_OUTPUT) {
        return 100 * noun + verb;
      }
    }
  }
}

console.log('Result:', computeResult());

