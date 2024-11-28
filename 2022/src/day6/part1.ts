console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n')[0].split('');

let result: number = 0;
for (let i = 3; i < input.length; i++) {
  const d = new Set<string>(input.slice(i - 3, i + 1));
  if (d.size === 4) {
    result = i + 1;
    break;
  }
}

console.assert(result === 1965, 'Result should be 1965 but is ' + result);