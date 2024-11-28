console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});
const input = rawInput.split('\n');

const splitInput = [...Array(Math.ceil(input.length / 3))].map(_ => input.splice(0, 3));

const getItemValue = (item: number) => item> 97 ? item - 96 : item- 38; 

const result = splitInput.map((chunk) => {
  const [c1, c2, c3] = chunk;
  const repeatedCharValue = c1.split('').find((char) => c2.includes(char) && c3.includes(char)).charCodeAt(0);
  return getItemValue(repeatedCharValue);
}).reduce((a, b) => a + b, 0);

console.assert(result === 70, 'Result should be 70 but was ' + result);
