console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
const DEBUG = false;
const NUMBER_OF_ROUNDS = 10;
const EXPAND_FACTOR = 2;
type Direction = 'N' | 'E' | 'S' | 'W';

// parsing
const board: string[][] = Array(input.length * (EXPAND_FACTOR + 1))
  .fill(null)
  .map(() => Array(input[0].length * (EXPAND_FACTOR + 1)).fill('.'));

input.forEach((row, y) => {
  row.split('').forEach((char, x) => {
    board[y + (input.length * EXPAND_FACTOR / 2)][x + (input.length * EXPAND_FACTOR / 2)] = char;
  });
});

// functions
const printBoard = (board: string[][]) => {
  console.log('   0123456789');
  board.forEach((row, i) => console.log(`${i < 10 ? ' ' : ''}${i} `.concat(row.join(''))));
};
const getSuggestionOrder = (round: number): Direction[] => {
  const r = round % 4;
  if (r === 0) return ['N', 'S', 'W', 'E'];
  if (r === 1) return ['S', 'W', 'E', 'N'];
  if (r === 2) return ['W', 'E', 'N', 'S'];
  if (r === 3) return ['E', 'N', 'S', 'W'];
};
const checkDirection = (x: number, y: number, board: string[][], direction: Direction): boolean => {
  switch (direction) {
    case 'N':
      return board[y - 1][x - 1] === '.' && board[y - 1][x] === '.' && board[y - 1][x + 1] === '.';
    case 'S':
      return board[y + 1][x - 1] === '.' && board[y + 1][x] === '.' && board[y + 1][x + 1] === '.';
    case 'W':
      return board[y - 1][x - 1] === '.' && board[y][x - 1] === '.' && board[y + 1][x - 1] === '.';
    case 'E':
      return board[y - 1][x + 1] === '.' && board[y][x + 1] === '.' && board[y + 1][x + 1] === '.';
  }
};
const getNextPosition = (x: number, y: number, board: string[][], round: number): [number, number] | null => {
  if (
    board[y - 1][x - 1] === '.' &&
    board[y - 1][x] === '.' &&
    board[y - 1][x + 1] === '.' &&
    board[y + 1][x - 1] === '.' &&
    board[y + 1][x] === '.' &&
    board[y + 1][x + 1] === '.' &&
    board[y][x - 1] === '.' &&
    board[y][x + 1] === '.'
  ) return null;
  const possiblePositions: [number, number][] = [];
  const suggestionOrder = getSuggestionOrder(round);
  suggestionOrder.forEach(direction => {
    const isDirectionValid = checkDirection(x, y, board, direction);
    if (isDirectionValid) {
      switch (direction) {
        case 'N':
          possiblePositions.push([x, y - 1]);
          break;
        case 'S':
          possiblePositions.push([x, y + 1]);
          break;
        case 'W':
          possiblePositions.push([x - 1, y]);
          break;
        case 'E':
          possiblePositions.push([x + 1, y]);
          break;
      }
    }
  });

  return possiblePositions.length > 0 ? possiblePositions[0] : null;
};
const locationToString = (x: number, y: number) => `${x},${y}`;
const stringToLocation = (location: string) => location.split(',').map(Number) as [number, number];

// algorithm
DEBUG && printBoard(board);
for (let i = 0; i < 10; i++) {
  // <current, intended>, both in x,y format
  const intendedPositions = new Map<string, string>();
  // <intended, amount>, intended in x,y format
  const intendedPositionAmounts = new Map<string, number>();
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      intendedPositionAmounts.set(locationToString(x, y), 0);
    }
  }

  // phase 1
  for (let y = 1; y < board.length - 1; y++) {
    for (let x = 1; x < board[0].length - 1; x++) {
      if (board[y][x] === '.') {
        continue;
      }

      const nextPosition = getNextPosition(x, y, board, i);

      if (nextPosition === null) {
        continue;
      }

      const [nextX, nextY] = nextPosition;
      const nextPositionString = locationToString(nextX, nextY);
      intendedPositions.set(locationToString(x, y), nextPositionString);
      intendedPositionAmounts.set(nextPositionString, intendedPositionAmounts.get(nextPositionString) + 1);
    }
  }

  // console.log(Array.from(intendedPositionAmounts.entries())
  //   .filter(([k, v]) => v > 1)
  //   .map(([k, v]) => `${k}: ${v}`).join('')
  // );

  // phase 2
  for (let y = 1; y < board.length - 1; y++) {
    for (let x = 1; x < board[0].length - 1; x++) {
      if (board[y][x] === '.') {
        continue;
      }
      const newIntendedPosition = intendedPositions.get(locationToString(x, y));
      if (!newIntendedPosition) {
        continue;
      }

      if (intendedPositionAmounts.get(newIntendedPosition) === 1) {
        const [newX, newY] = stringToLocation(newIntendedPosition);

        board[newY][newX] = '#';
        board[y][x] = '.';

      }
    }
  }
  DEBUG && console.log('\n Round', i + 1);
  DEBUG && printBoard(board);
}

// solution
const minY = board.findIndex(row => row.join('').includes('#'));
const maxY = board.length - 1 - board.map(row => row.slice()).reverse().findIndex(row => row.some(char => char === '#'));
const minX = Math.min(...board.map(row => row.indexOf('#') > 0 ? row.indexOf('#') : Infinity));
const maxX = Math.max(...board.map(row => row.lastIndexOf('#') > 0 ? row.lastIndexOf('#') : -1));

const reducedBoard = board.slice(minY, maxY + 1).map(row => row.slice(minX, maxX + 1));
let total = 0;
reducedBoard.forEach(row => {
  row.forEach(char => {
    if (char === '.') total++;
  });
});

const result = total;
console.assert(result === 110, `Expected 110, got ${result}`);