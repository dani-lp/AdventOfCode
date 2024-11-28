console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
type Point = { x: number; y: number; };
type Direction = '>' | '<' | '^' | 'v';
type Blizzard = {
  position: Point;
  direction: Direction;
}

// parsing
const map: string[][] = input.map((row) => {
  return row.split('');
});
const initialPosition: Point = { x: 1, y: 0 };
const finalPosition: Point = { x: map[0].length - 2, y: map.length - 1 };
console.assert(map[initialPosition.y][initialPosition.x] === '.');
console.assert(map[finalPosition.y][finalPosition.x] === '.');

const blizzards: Blizzard[] = [];
map.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell !== '.' && cell !== '#') {
      blizzards.push({
        position: { x, y },
        direction: cell as Direction,
      });
    }
  });
});

// functions
const getAvailablePositions = (currentPosition: Point, blizzards: Blizzard[]): Point[] => {
  const availablePositions: Point[] = [];
  const x = currentPosition.x;
  const y = currentPosition.y;
  if (x + 1 < map[0].length && map[y][x + 1] !== '#') {
    availablePositions.push({ x: x + 1, y });
  }
  if (x - 1 >= 0 && map[y][x - 1] !== '#') {
    availablePositions.push({ x: x - 1, y });
  }
  if (y + 1 < map.length && map[y + 1][x] !== '#') {
    availablePositions.push({ x, y: y + 1 });
  }
  if (y - 1 >= 0 && map[y - 1][x] !== '#') {
    availablePositions.push({ x, y: y - 1 });
  }
  const filteredPositions = availablePositions.concat(currentPosition).filter((position) => {
    return !blizzards.some((blizzard) => {
      return blizzard.position.x === position.x && blizzard.position.y === position.y;
    });
  });
  return filteredPositions;
};

const distanceToFinalPosition = (position: Point): number => (
  Math.sqrt(Math.pow(position.x - finalPosition.x, 2) + Math.pow(position.y - finalPosition.y, 2))
);

const strToPoint = (str: string): Point => {
  const [x, y] = str.split(',').map(Number);
  return { x, y };
};

// algorithm
let round = 0;
let end = false;
let positionsToCheck: string[] = [`${initialPosition.x},${initialPosition.y}`];
let newPositions: string[] = [];
let currentBlizzards = blizzards;
while (!end) {
  // 1.- compute new blizzard positions
  const newBlizzards = currentBlizzards.map((blizzard) => {
    const x = blizzard.position.x;
    const y = blizzard.position.y;
    switch (blizzard.direction) {
      case '>':
        return {
          ...blizzard,
          position: { x: x === map[0].length - 2 ? 1 : x + 1, y },
        };
      case '<':
        return {
          ...blizzard,
          position: { x: x === 1 ? map[0].length - 2 : x - 1, y },
        };
      case '^':
        return {
          ...blizzard,
          position: { x, y: y === 1 ? map.length - 2 : y - 1 },
        };
      case 'v':
        return {
          ...blizzard,
          position: { x, y: y === map.length - 2 ? 1 : y + 1 },
        };
    }
  });

  positionsToCheck.forEach((p) => {
    const position = strToPoint(p);

    // 2.- compute new current position
    const availablePositions: Point[] = getAvailablePositions(position, newBlizzards);

    // 3.- check if we are in the final position
    if (availablePositions.some((position) => (
      position.x === finalPosition.x && position.y === finalPosition.y
    ))) {
      end = true;
      return;
    }

    // 4.- if not, add new states to check and repeat
    newPositions.push(...availablePositions.map(p => `${p.x},${p.y}`));
  });
  round++;
  currentBlizzards = newBlizzards;
  positionsToCheck = [...new Set(newPositions)];
  newPositions = [];
}

// output
const result = round;
console.assert(result === 18, `Expected 18, got ${result}`);