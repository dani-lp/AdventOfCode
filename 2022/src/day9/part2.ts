console.clear();

// parsing
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// type declarations
type Point = { x: number, y: number };

// helper functions
const singleStep = (pos: Point, dir: string): void => {
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

const moveTail = (
  headPos: Point,
  tailPos: Point,
  total: Set<string>,
  isTail: boolean,
  i: number,
): string => {
  if (isOverlap(headPos, tailPos)) return;

  if (!isTailTouching(headPos, tailPos)) {
    if (isTailDiagonal(headPos, tailPos)) {
      if (Math.abs(headPos.x - tailPos.x) > 1 && Math.abs(headPos.y - tailPos.y) > 1) {
        tailPos.x = headPos.x + (headPos.x > tailPos.x ? -1 : 1);
        tailPos.y = headPos.y + (headPos.y > tailPos.y ? -1 : 1);
      } else if (Math.abs(headPos.x - tailPos.x) > 1) {
        if (headPos.x > tailPos.x) tailPos.x = headPos.x - 1;
        else tailPos.x = headPos.x + 1;
        tailPos.y = headPos.y;
      } else if (Math.abs(headPos.y - tailPos.y) > 1) {
        if (headPos.y > tailPos.y) tailPos.y = headPos.y - 1;
        else tailPos.y = headPos.y + 1;
        tailPos.x = headPos.x;
      }
    } else {
      if (headPos.x > tailPos.x) {
        tailPos.x = headPos.x - 1;
        tailPos.y = headPos.y;
      } else if (headPos.x < tailPos.x) {
        tailPos.x = headPos.x + 1;
        tailPos.y = headPos.y;
      } else if (headPos.y > tailPos.y) {
        tailPos.x = headPos.x;
        tailPos.y = headPos.y - 1;
      } else if (headPos.y < tailPos.y) {
        tailPos.x = headPos.x;
        tailPos.y = headPos.y + 1;
      }
    }
    if (isTail) addToTotal(tailPos, total);
  }
};

const isOverlap = (headPos: Point, tailPos: Point): boolean =>
  headPos.x === tailPos.x && headPos.y === tailPos.y;

const isTailTouching = (headPos: Point, tailPos: Point): boolean =>
  Math.abs(headPos.x - tailPos.x) <= 1 && Math.abs(headPos.y - tailPos.y) <= 1;

const isTailDiagonal = (headPos: Point, tailPos: Point): boolean =>
  Math.abs(headPos.x - tailPos.x) > 1 || Math.abs(headPos.y - tailPos.y) > 1;

const addToTotal = (pos: Point, total: Set<string>): void => {
  const posStr = `${pos.x},${pos.y}`;
  total.add(posStr);
};

// algorithm
const knots: Point[] = Array(10).fill(null).map(() => ({ x: 0, y: 0 }));
const tailVisitedPositions = new Set<string>();
addToTotal({ x: 0, y: 0 }, tailVisitedPositions);

input.forEach((mov) => {
  const [dir, step] = mov.split(' ');

  for (let i = 0; i < parseInt(step); i++) {
    singleStep(knots[0], dir);

    for (let j = 0; j < knots.length - 1; j++) {
      const currentHead = knots[j];
      const currentTail = knots[j + 1];

      moveTail(
        currentHead,
        currentTail,
        tailVisitedPositions,
        j === knots.length - 2,
        j + 1,
      );
    }
  };
});

const result = tailVisitedPositions.size;
console.assert(result === 2651, 'Result should be 2651 but is ' + result);