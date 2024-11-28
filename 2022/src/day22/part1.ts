console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
type Direction = 'R' | 'L' | 'U' | 'D';
type Point = { x: number, y: number };

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
const getWrapPosition = (currentPosition: Point, facing: Direction, board: string[][]): Point => {
  let nextIntendedPosition: Point;

  switch (facing) {
    case 'R':
      nextIntendedPosition = { ...currentPosition, x: 0 };
      while (
        board[nextIntendedPosition.y][nextIntendedPosition.x] !== '.' &&
        board[nextIntendedPosition.y][nextIntendedPosition.x] !== '#'
      ) nextIntendedPosition.x += 1;
      if (board[nextIntendedPosition.y][nextIntendedPosition.x] === '#') return currentPosition;
      return nextIntendedPosition;
    case 'D':
      nextIntendedPosition = { ...currentPosition, y: 0 };
      while (
        board[nextIntendedPosition.y][nextIntendedPosition.x] !== '.' &&
        board[nextIntendedPosition.y][nextIntendedPosition.x] !== '#'
      ) nextIntendedPosition.y += 1;
      if (board[nextIntendedPosition.y][nextIntendedPosition.x] === '#') return currentPosition;
      return nextIntendedPosition;
    case 'L':
      nextIntendedPosition = { ...currentPosition, x: board[0].length - 1 };
      while (
        board[nextIntendedPosition.y][nextIntendedPosition.x] !== '.' &&
        board[nextIntendedPosition.y][nextIntendedPosition.x] !== '#'
      ) nextIntendedPosition.x -= 1;
      if (board[nextIntendedPosition.y][nextIntendedPosition.x] === '#') return currentPosition;
      return nextIntendedPosition;
    case 'U':
      nextIntendedPosition = { ...currentPosition, y: board.length - 1 };
      while (
        board[nextIntendedPosition.y][nextIntendedPosition.x] !== '.' &&
        board[nextIntendedPosition.y][nextIntendedPosition.x] !== '#'
      ) nextIntendedPosition.y -= 1;
      if (board[nextIntendedPosition.y][nextIntendedPosition.x] === '#') return currentPosition;
      return nextIntendedPosition;
    default:
      return { ...currentPosition };
  }
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
        const nextPosition = getWrapPosition(currentPosition, facing, board);
        currentPosition.x = nextPosition.x;
        currentPosition.y = nextPosition.y;
      }
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