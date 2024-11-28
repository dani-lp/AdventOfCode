console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
const DEBUG = false;
type Direction = 'R' | 'L' | 'U' | 'D';
type Point = { x: number, y: number };
const SIDE_SIZE = 50;

// parsing
const rawInstructions = input[input.length - 1];
const rawBoard = input.slice(0, input.length - 2);

const boardLength = Math.max(...rawBoard.map(r => r.length));

const board: string[][] = rawBoard.map((row) => {
  return row.split('').concat(Array(boardLength - row.length).fill(' '));
});

const instructions: string[] = rawInstructions.match(/[a-zA-Z]+|[0-9]+/g);


// functions
const printBoard = (board: string[][]) => board.forEach((r) => console.log(r.join('')));
const changeDirection = (currentDirection: Direction, change: 'L' | 'R', directions: Direction[]): Direction => {
  const directionIndex = directions.indexOf(currentDirection);
  if (change === 'L') {
    if (directionIndex - 1 < 0) return directions[directions.length - 1];
    return directions[directionIndex - 1];
  } else {
    return directions[(directionIndex + 1) % directions.length];
  }
};
const getNextPosition = (currentPosition: Point, facing: Direction, board: string[][]): Point => {
  switch (facing) {
    case 'R':
      return { ...currentPosition, x: (currentPosition.x + 1) % board[0].length };
    case 'D':
      return { ...currentPosition, y: (currentPosition.y + 1) % board.length };
    case 'L':
      if (currentPosition.x - 1 < 0) return { ...currentPosition, x: board[0].length - 1 };
      return { ...currentPosition, x: (currentPosition.x - 1) };
    case 'U':
      if (currentPosition.y - 1 < 0) return { ...currentPosition, y: board.length - 1 };
      return { ...currentPosition, y: (currentPosition.y - 1) };
    default:
      return { ...currentPosition };
  }
};
const getWrapPosition = (currentPosition: Point, facing: Direction, board: string[][]): [Point, Direction] => {
  let nextIntendedPosition: Point;
  let nextFacingDirection: Direction;

  switch (facing) {
    case 'R':
      if (currentPosition.y < SIDE_SIZE) {
        nextFacingDirection = 'L';
        nextIntendedPosition = { x: SIDE_SIZE * 2 - 1, y: SIDE_SIZE * 3 - currentPosition.y - 1 };
      } else if (currentPosition.y < SIDE_SIZE * 2) {
        nextFacingDirection = 'U';
        nextIntendedPosition = { x: SIDE_SIZE * 2 + (currentPosition.y % SIDE_SIZE), y: SIDE_SIZE - 1 };
      } else if (currentPosition.y < SIDE_SIZE * 3) {
        nextFacingDirection = 'L';
        nextIntendedPosition = { x: SIDE_SIZE * 3 - 1, y: SIDE_SIZE - (currentPosition.y % SIDE_SIZE) - 1 };
      } else {
        nextFacingDirection = 'U';
        nextIntendedPosition = { x: SIDE_SIZE + (currentPosition.y % SIDE_SIZE), y: SIDE_SIZE * 3 - 1 };
      }
      break;
    case 'D':
      if (currentPosition.x < SIDE_SIZE) {
        nextFacingDirection = 'D';
        nextIntendedPosition = { x: SIDE_SIZE * 2 + currentPosition.x, y: 0 };
      } else if (currentPosition.x < SIDE_SIZE * 2) {
        nextFacingDirection = 'L';
        nextIntendedPosition = { x: SIDE_SIZE - 1, y: SIDE_SIZE * 3 + (currentPosition.x % SIDE_SIZE) };
      } else {
        nextFacingDirection = 'L';
        nextIntendedPosition = { x: SIDE_SIZE * 2 - 1, y: SIDE_SIZE + (currentPosition.x % SIDE_SIZE) };
      }
      break;
    case 'L':
      if (currentPosition.y < SIDE_SIZE) {
        nextFacingDirection = 'R';
        nextIntendedPosition = { x: 0, y: SIDE_SIZE * 3 - currentPosition.y - 1 };
      } else if (currentPosition.y < SIDE_SIZE * 2) {
        nextFacingDirection = 'D';
        nextIntendedPosition = { x: currentPosition.y % SIDE_SIZE, y: SIDE_SIZE * 2 };
      } else if (currentPosition.y < SIDE_SIZE * 3) {
        nextFacingDirection = 'R';
        nextIntendedPosition = { x: SIDE_SIZE, y: SIDE_SIZE - (currentPosition.y % SIDE_SIZE) - 1 }; // revise
      } else {
        nextFacingDirection = 'D';
        nextIntendedPosition = { x: SIDE_SIZE + (currentPosition.y % SIDE_SIZE), y: 0 };
      }
      break;
    case 'U':
      if (currentPosition.x < SIDE_SIZE) {
        nextFacingDirection = 'R';
        nextIntendedPosition = { x: SIDE_SIZE, y: SIDE_SIZE + currentPosition.x };
      } else if (currentPosition.x < SIDE_SIZE * 2) {
        nextFacingDirection = 'R';
        nextIntendedPosition = { x: 0, y: SIDE_SIZE * 3 + (currentPosition.x % SIDE_SIZE) };
      } else {
        nextFacingDirection = 'U';
        nextIntendedPosition = { x: currentPosition.x % SIDE_SIZE, y: SIDE_SIZE * 4 - 1 };
      }
      break;
  }
  // console.log('currentPosition', currentPosition);
  // console.log('facing', facing);
  // console.log('nextIntendedPosition', nextIntendedPosition);
  // console.log('nextFacingDirection', nextFacingDirection);

  // console.log('\n\n');


  if (board[nextIntendedPosition.y][nextIntendedPosition.x] === '#') return [currentPosition, facing];
  return [nextIntendedPosition, nextFacingDirection];
};


// algorithm
const directions: Direction[] = ['R', 'D', 'L', 'U'];
let facing: Direction = directions[0];
const currentPosition: Point = { x: 0, y: 0 };
while (board[currentPosition.y][currentPosition.x] === ' ') {
  currentPosition.x += 1;
}

instructions.forEach((instruction, i) => {
  if (instruction === 'L' || instruction === 'R') {
    facing = changeDirection(facing, instruction, directions);
    if (DEBUG) console.log('New direction:', facing);

  } else {
    const movementAmount = parseInt(instruction);
    for (let i = 0; i < movementAmount; i++) {
      const nextPosition = getNextPosition(currentPosition, facing, board);
      const nextPositionElement = board[nextPosition.y][nextPosition.x];
      if (nextPositionElement === '.') {
        // move
        currentPosition.x = nextPosition.x;
        currentPosition.y = nextPosition.y;
      } else if (nextPositionElement === '#') {
        // hit a wall
        continue;
      } else {
        // wrap
        const [nextPosition, nextFacing] = getWrapPosition(currentPosition, facing, board);
        facing = nextFacing;
        currentPosition.x = nextPosition.x;
        currentPosition.y = nextPosition.y;
      }
    }
    if (DEBUG) {
      board.forEach((r, y) => {
        const toPrintRow = r.join('');
        if (currentPosition.y === y) {
          console.log(toPrintRow.substring(0, currentPosition.x) + 'X' + toPrintRow.substring(currentPosition.x + 1));
        } else {
          console.log(toPrintRow);
        }
      });
      console.log('currentPosition', currentPosition);
      console.log('facing', facing);

      console.log('\n');
    }

  }
});

// result
const directionValues = {
  R: 0,
  D: 1,
  L: 2,
  U: 3,
} as const;

const result = (currentPosition.y + 1) * 1000 + (currentPosition.x + 1) * 4 + directionValues[facing];
console.assert(result === 6032, `Expected 6032, got ${result}`);