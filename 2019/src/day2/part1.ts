import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'}).trim();
const input = rawInput.split(',').map((line) => parseInt(line));

let pc = 0;

input[1] = 12;
input[2] = 2;

while (pc < input.length) {
  const r1Val = input[pc + 1];
  const r2Val = input[pc + 2];
  const r3Val = input[pc + 3];

  switch (input[pc]) {
    case 1:
      input[r3Val] = input[r1Val] + input[r2Val];
      break;
    case 2:
      input[r3Val] = input[r1Val] * input[r2Val];
      break;
    case 99:
      break;
  }
  pc += 4;
}

console.log('Result:', input[0]);

