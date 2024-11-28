console.clear();

// parsing
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

const TO_REPLACE = input.filter((line) => line.split(' ')[0] === 'addx').length;
const lines = Array(input.length + TO_REPLACE).fill('');

let it = 0;
input.forEach((line) => {
  const instruction = line.split(' ')[0];
  lines[it] = line;
  it++;
  if (instruction === 'addx') {
    lines[it] = 'noop';
    it++;
  }
});

// types and helpers
const CRT_WIDTH = 40;

// algorithm
const renderer = Array(6).fill(null).map(() => Array(40).fill('.'));

let x = 1;
let cycle = 0;
let toAdd = 0;
lines.forEach((line) => {
  const [instruction, value] = line.split(' ');
  cycle++;
  if (toAdd != 0) {
    x += toAdd;
    toAdd = 0;
  }
  
  // draw
  const spritePositions = [x - 1, x, x + 1];
  const yPos = Math.floor(cycle / CRT_WIDTH);
  const xPos = cycle % CRT_WIDTH;
  
  if (spritePositions.includes(xPos)) {
    renderer[yPos][xPos] = '#';
  }

  // continue
  if (instruction === 'noop') {
    return;
  }
  if (value) toAdd = parseInt(value);

});

renderer.forEach((line) => console.log(line.join('')));