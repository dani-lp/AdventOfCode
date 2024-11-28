console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');


const result = input.map((line) => {
  const [r1, r2] = line.split(',');
  const [r1Min, r1Max] = r1.split('-').map(Number);
  const [r2Min, r2Max] = r2.split('-').map(Number);

  return (r1Min <= r2Min && r1Max >= r2Max) || (r2Min <= r1Min && r1Max <= r2Max) ? 1 : 0;
}).reduce((a, b) => a + b, 0);

console.assert(result === 2, 'Result should be 2 but was ' + result);