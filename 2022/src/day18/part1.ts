console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});
const input = rawInput.split('\n');

// types and consts
type Point = { x: number, y: number, z: number };

// parsing
const OFFSET = 8;
const maxPoint = Math.max(...input.join(',').split(',').map(x => parseInt(x)));
const grid = new Array(maxPoint + OFFSET).fill(0).map(() => new Array(maxPoint + OFFSET).fill(0).map(() => new Array(maxPoint + OFFSET).fill('.')));
const points: Point[] = [];
input.forEach((row) => {
  const [x, y, z] = row.split(',').map(x => parseInt(x));
  grid[x + 1][y + 1][z + 1] = '#';
  points.push({ x: x + 1, y: y + 1, z: z + 1 });
});

// functions
const getSurfaceArea = (x: number, y: number, z: number): number => {
  let surfaceArea = 0;
  if (grid[x][y][z] === '#') {
    if (grid[x + 1][y][z] === '.') surfaceArea++;
    if (grid[x - 1][y][z] === '.') surfaceArea++;
    if (grid[x][y + 1][z] === '.') surfaceArea++;
    if (grid[x][y - 1][z] === '.') surfaceArea++;
    if (grid[x][y][z + 1] === '.') surfaceArea++;
    if (grid[x][y][z - 1] === '.') surfaceArea++;
  }
  return surfaceArea;
};

// algorithm
let total = 0;
points.forEach((point) => {
  const { x, y, z } = point;
  total += getSurfaceArea(x, y, z);
});

// solution
const result = total;
console.assert(result === 64, 'Expected 64, got ' + result);