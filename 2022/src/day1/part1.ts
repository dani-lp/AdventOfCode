import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});
const input = rawInput.split('\n');

let counter = 0;
const calories: number[] = [];
input.forEach(element => {
  if (element.length > 0) {
    if (!calories[counter]) calories[counter] = 0;
    calories[counter] += parseInt(element);
  }
  else counter++;
});

const result = Math.max(...calories);

console.log(result);