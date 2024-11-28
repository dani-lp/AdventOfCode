console.clear();

// parsing
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// type declarations
type Point = { x: number, y: number };

// helper functions
const step = (pos: Point, dir: string): void => {
  switch (dir) {
    case 'R':
      pos.x++;
      break;
    case 'L':
      pos.x--;
      break;
    case 'U':
      pos.y++;
      break;
    case 'D':
      pos.y--;
      break;
  }
}

const move = (headPos: Point, tailPos: Point, dir: string, total: Set<string>): void => {
  step(headPos, dir);
  if (!isTailTouching(headPos, tailPos)) {
    if (isTailDiagonal(headPos, tailPos)) {
      step(tailPos, dir);
      if (dir === 'U') {
        tailPos.x = headPos.x;
        tailPos.y = headPos.y - 1;
      } else if (dir === 'D') {
        tailPos.x = headPos.x;
        tailPos.y = headPos.y + 1;
      } else if (dir === 'R') {
        tailPos.x = headPos.x - 1;
        tailPos.y = headPos.y;
      } else {
        tailPos.x = headPos.x + 1;
        tailPos.y = headPos.y;
      }
    } else {
      step(tailPos, dir);
    }
    addToTotal(tailPos, total);
  }
};

const isTailTouching = (headPos: Point, tailPos: Point): boolean =>
  Math.abs(headPos.x - tailPos.x) <= 1 && Math.abs(headPos.y - tailPos.y) <= 1;

const isTailDiagonal = (headPos: Point, tailPos: Point): boolean =>
  Math.abs(headPos.x - tailPos.x) > 1 || Math.abs(headPos.y - tailPos.y) > 1;

const addToTotal = (pos: Point, total: Set<string>): void => {
  const posStr = `${pos.x},${pos.y}`;
  total.add(posStr);
};

// algorithm
const headPosition: Point = { x: 0, y: 0 };
const tailPosition: Point = { x: 0, y: 0 };
const tailVisitedPositions = new Set<string>();
addToTotal(tailPosition, tailVisitedPositions);

input.forEach((mov) => {
  const [dir, step] = mov.split(' ');

  for (let i = 0; i < parseInt(step); i++) {
    move(headPosition, tailPosition, dir, tailVisitedPositions);
  }
});

const result = tailVisitedPositions.size;
console.assert(result === 13, 'Result should be 13 but is ' + result);