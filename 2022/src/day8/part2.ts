console.clear();

import fs from 'fs';
const filename = 'testinput.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

let scores: number[] = [];
for (let i = 1; i < input.length - 1; i++) {
  for (let j = 1; j < input[i].length - 1; j++) {
    const tree = parseInt(input[i][j]);

    const rightRow = input[i]
      .slice(j + 1, input[i].length)
      .split('')
      .map(Number);
    const leftRow = input[i]
      .slice(0, j)
      .split('')
      .reverse()
      .map(Number);
    const topRow = input
      .map((row) => row[j])
      .join('')
      .slice(0, i)
      .split('')
      .reverse()
      .map(Number);
    const bottomRow = input
      .map((row) => row[j])
      .join('')
      .slice(i + 1, input.length)
      .split('')
      .map(Number);

    const rightLimit = rightRow.findIndex((t) => t >= tree);
    const leftLimit = leftRow.findIndex((t) => t >= tree);
    const topLimit = topRow.findIndex((t) => t >= tree);
    const bottomLimit = bottomRow.findIndex((t) => t >= tree);

    const rightScore = rightLimit === -1 ? rightRow.length : rightRow.splice(0, rightLimit + 1).length;
    const leftScore = leftLimit === -1 ? leftRow.length : leftRow.splice(0, leftLimit + 1).length;
    const topScore = topLimit === -1 ? topRow.length : topRow.splice(0, topLimit + 1).length;
    const bottomScore = bottomLimit === -1 ? bottomRow.length : bottomRow.splice(0, bottomLimit + 1).length;
    
    const score = rightScore * leftScore * topScore * bottomScore;
    scores.push(score);
  }
}

const result = Math.max(...scores);

console.assert(result === 8, 'Expected 8, got ' + result);