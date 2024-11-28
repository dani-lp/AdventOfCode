console.clear();

import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

const isVisible = (input: string, tree: number, from: number, to: number): boolean => 
  input.slice(from, to).split('').map(Number).every((t) => t < tree);

let count = (input.length * 2) + (input[0].length * 2) - 4;
for (let i = 1; i < input.length - 1; i++) {
  for (let j = 1; j < input[i].length - 1; j++) {
    const tree = parseInt(input[i][j]);

    const rightVisible = isVisible(input[i], tree, j + 1, input[i].length);
    const leftVisible = isVisible(input[i], tree, 0, j);
    const topVisible = isVisible(input.map((row) => row[j]).join(''), tree, 0, i);
    const bottomVisible = isVisible(input.map((row) => row[j]).join(''), tree, i + 1, input.length);

    const visible = rightVisible || leftVisible || topVisible || bottomVisible;
    if (visible) count++;
  }
}

const result = count;

console.assert(result === 1812, 'Expected 1812, got ' + result);