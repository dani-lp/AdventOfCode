console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n')[0].split('');

let result: number = 0;
for (let i = 0; i < input.length; i++) {
  const d = new Set<string>(input.slice(i, i + 14));
  if (d.size === 14) {
    result = i + 14;
    break;
  }
}

console.assert(result === 2773, 'Result should be 2773 but is ' + result);