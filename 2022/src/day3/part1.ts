console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});
const input = rawInput.split('\n');

const result = input.map((line) => {
  const c1 = line.slice(0, line.length / 2);
  const c2 = line.slice(line.length / 2, line.length);

  const repeatedCharValue = c1.split('').find((char) => c2.includes(char)).charCodeAt(0);

  return repeatedCharValue > 97 ? repeatedCharValue - 96 : repeatedCharValue - 38; 
}).reduce((a, b) => a + b, 0);

console.assert(result === 157, 'Result should be 157 but was ' + result);
