import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'}).trim();
const input = rawInput.split('\n');

function getModuleFuel(mass: number) {
  return Math.floor(mass / 3) - 2;
}

const result = input
  .map((line) => parseInt(line))
  .map(getModuleFuel)
  .reduce((a, b) => a + b, 0);

console.log('Result:', result);
