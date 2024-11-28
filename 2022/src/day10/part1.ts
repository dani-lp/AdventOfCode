console.clear();

// parsing
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});
const input = rawInput.split('\n');

const TO_REPLACE = input.filter((line) => line.split(' ')[0] === 'addx').length;
const lines = Array(input.length + TO_REPLACE).fill('');

let it = 0;
input.forEach((line ) => {
  const instruction = line.split(' ')[0];
  lines[it] = line;
  it++;
  if (instruction === 'addx') {
    lines[it] = 'noop';
    it++;
  }
});

// types and helpers
const getStrength = (cycle: number, x: number) => cycle * x;

// algorithm
const strengths = new Map<number, number>();
let x = 1;
let cycle = 0;
let toAdd = 0;
lines.forEach((line) => {
  const [instruction, value] = line.split(' ');
  cycle++;
  strengths.set(cycle, getStrength(cycle, x));
  if (toAdd != 0) {
    x += toAdd;
    toAdd = 0;
  }
  if (instruction === 'noop') {
    return;
  }
  if (value) toAdd = parseInt(value);
});

const objCycles = [20, 60, 100, 140, 180, 220];
const result = objCycles.map((c) => strengths.get(c)).reduce((a, b) => a + b, 0);

console.assert(result === 11720, 'Resuld should be 11720 but was ' + result);