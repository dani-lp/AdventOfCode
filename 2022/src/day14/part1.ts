console.clear();
import fs from 'fs';
const filename = 'testinput.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and constants
type Point = { x: number, y: number };
type Direction = '-1' | '0' | '1';
const SAND_ORIGIN: Point = { x: 500, y: 0 };
const ROCK_CHAR = '#';
const AIR_CHAR = '.';
const SAND_CHAR = 'o';

// functions
const logCave = (cave: string[][], minX: number, maxX: number) => cave.forEach((row) => console.log(row.splice(minX - 10, maxX + 10).join('')));
const directionToFollow = (cave: string[][], sandUnit: Point): Direction | null => {
  const { x, y } = sandUnit;

  const below = cave[y + 1][x];
  const left = cave[y + 1][x - 1];
  const right = cave[y + 1][x + 1];

  if (below === AIR_CHAR) {
    return '0';
  } else if (left === AIR_CHAR) {
    return '-1';
  } else if (right === AIR_CHAR) {
    return '1';
  } else {
    return null;
  }
};

// parsing
const rockPaths = input.map((line) => line.split(' -> '));
const rocks: Point[][] = rockPaths.map((path) => path.map((point) => {
  const [x, y] = point.split(',').map((coord) => parseInt(coord));
  return { x, y };
}));

const xCoordSet = new Set<number>();
const yCoordSet = new Set<number>();
for (let i = 0; i < rocks.length; i++) {
  const rock = rocks[i];
  for (let j = 0; j < rock.length; j++) {
    const point = rock[j];
    xCoordSet.add(point.x);
    yCoordSet.add(point.y);
  }
}

const minX = Math.min(...xCoordSet);
const minY = Math.min(...yCoordSet);
const maxX = Math.max(...xCoordSet);
const maxY = Math.max(...yCoordSet);

const cave: string[][] = Array(maxY + 5).fill(null).map(() => Array(maxX + 5).fill('.'));
rocks.forEach((rock) => {
  for (let i = 0; i < rock.length - 1; i++) {
    const rockStart = rock[i];
    const rockEnd = rock[i + 1];

    if (rockStart.x === rockEnd.x) {
      if (rockStart.y < rockEnd.y) {
        for (let y = rockStart.y; y <= rockEnd.y; y++) {
          cave[y][rockStart.x] = ROCK_CHAR;
        }
      } else {
        for (let y = rockStart.y; y >= rockEnd.y; y--) {
          cave[y][rockStart.x] = ROCK_CHAR;
        }
      }
    } else {
      if (rockStart.x < rockEnd.x) {
        for (let x = rockStart.x; x <= rockEnd.x; x++) {
          cave[rockStart.y][x] = ROCK_CHAR;
        }
      } else {
        for (let x = rockStart.x; x >= rockEnd.x; x--) {
          cave[rockStart.y][x] = ROCK_CHAR;
        }
      }
    }
  }
});

// algorithm
let abyssBroken = false;
let sandCounter = 0;
while (!abyssBroken) {
  const sandUnit: Point = { x: SAND_ORIGIN.x, y: SAND_ORIGIN.y };
  let newDirection = directionToFollow(cave, sandUnit);
  while ((newDirection = directionToFollow(cave, sandUnit)) !== null && sandUnit.y <= maxY) {
    if (newDirection === '0') {
      sandUnit.y++;
    } else if (newDirection === '-1') {
      sandUnit.x--;
      sandUnit.y++;
    } else if (newDirection === '1') {
      sandUnit.x++;
      sandUnit.y++;
    }
  }
  cave[sandUnit.y][sandUnit.x] = SAND_CHAR;
  sandCounter++;

  if (sandUnit.y > maxY) {
    abyssBroken = true;
    break;
  }
};
logCave(cave, minX, maxX);
console.log('Result:', sandCounter - 1);
