import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'}).trim();
const input = rawInput.split('\n');

function getModuleFuel(mass: number) {
  function internalGetModuelFuel(fuel: number) {
    return Math.floor(fuel / 3) - 2;
  }

  let total = internalGetModuelFuel(mass);
  let current = total;

  while(internalGetModuelFuel(current) > 0) {
    const newValue = internalGetModuelFuel(current);
    total += newValue;
    current = newValue;
  }

  return total;
}

const result = input
  .map((line) => parseInt(line))
  .map(getModuleFuel)
  .filter((value) => value > 0)
  .reduce((a, b) => a + b, 0);

console.log('Result:', result);

