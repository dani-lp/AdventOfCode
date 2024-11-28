console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const gasMovements = rawInput.split('');
let DEBUG = false;

// types and consts
const CHAMBER_WIDTH = 7;
const SPAWN_Y_OFFSET = 3;
const EMPTY_ROW = Array(CHAMBER_WIDTH).fill('.');
const ROCKS_TO_FALL = 1_000_000_000_000;
const ROCK_0 = [
  ['.', '.', 'O', 'O', 'O', 'O', '.'],
];
const ROCK_1 = [
  ['.', '.', '.', 'O', '.', '.', '.'],
  ['.', '.', 'O', 'O', 'O', '.', '.'],
  ['.', '.', '.', 'O', '.', '.', '.'],
];
const ROCK_2 = [
  ['.', '.', 'O', 'O', 'O', '.', '.'],
  ['.', '.', '.', '.', 'O', '.', '.'],
  ['.', '.', '.', '.', 'O', '.', '.'],
];
const ROCK_3 = [
  ['.', '.', 'O', '.', '.', '.', '.'],
  ['.', '.', 'O', '.', '.', '.', '.'],
  ['.', '.', 'O', '.', '.', '.', '.'],
  ['.', '.', 'O', '.', '.', '.', '.'],
];
const ROCK_4 = [
  ['.', '.', 'O', 'O', '.', '.', '.'],
  ['.', '.', 'O', 'O', '.', '.', '.'],
];
const rocks = [ROCK_0, ROCK_1, ROCK_2, ROCK_3, ROCK_4];

const rockHeights = rocks.map((rock) => rock.length);


// functions
const printRock = (rock: string[][]) => {
  rock.forEach((row) => console.log(row.join('')));
  console.log('');
};

const moveRockLeft = (rock: string[][], i: number): string[][] => {
  const rockCopy = rock.map((row) => row.slice());
  const leftMostRockIndex = Math.min(...rock.map((row) => row.indexOf('O')));
  let extraCheck = false;
  if ((i % rocks.length) === 1) {
    extraCheck ||= rock.some((row) => row[leftMostRockIndex + 1] === 'O' && row[leftMostRockIndex] === '#');
  }
  if (
    leftMostRockIndex === 0 ||
    rock.some((row) => row[leftMostRockIndex] === 'O' && row[leftMostRockIndex - 1] === '#') ||
    extraCheck
  ) return rock;
  const newBlockPosition = rock.map((row) =>
    row.slice(1, row.length).concat('.')
      .map((cell) => cell === '#' ? '.' : cell)
  );
  return newBlockPosition.map((row, i) => row.map((cell, j) => rockCopy[i][j] === '#' ? '#' : cell));
};

const moveRockRight = (rock: string[][], i: number): string[][] => {
  const rockCopy = rock.map((row) => row.slice());
  const rightMostRockIndex = Math.max(...rock.map((row) => row.lastIndexOf('O')));
  let extraCheck = false;
  if ((i % rocks.length) === 1) {
    extraCheck ||= rock.some((row) => row[rightMostRockIndex - 1] === 'O' && row[rightMostRockIndex] === '#');
  }
  if (
    rightMostRockIndex === CHAMBER_WIDTH - 1 ||
    rock.some((row) => row[rightMostRockIndex] === 'O' && row[rightMostRockIndex + 1] === '#') ||
    extraCheck
  ) return rock;
  const newBlockPosition = rock.map((row) => ['.']
    .concat(row.slice(0, row.length - 1)
      .map((cell) => cell === '#' ? '.' : cell)
    ));
  return newBlockPosition.map((row, i) => row.map((cell, j) => rockCopy[i][j] === '#' ? '#' : cell));
}

// algorithm
const buildNewGrid = (limit: number = 5000): Map<number, number> => {
  const grid: string[][] = Array(0).fill(null).map(() => Array(CHAMBER_WIDTH).fill('.'));
  const printGrid = (msg?: string) => {
    const LIMIT = 15 || grid.length;
    if (msg) console.log(msg);
    grid.slice(0, LIMIT).forEach((row, i) => console.log(`${i < 10 ? `0${i}` : i} |${row.join('')}|`));
    console.log('   +-------+');
    console.log('');
  };

  let gasMovementCounter = 0;
  const sizes = new Map<number, number>();
  // for (let i = 0; i < ROCKS_TO_FALL; i++) {
  for (let i = 0; i < limit; i++) {
    // DEBUG = i >= LIMIT;
    const rock = rocks[i % rocks.length];
    DEBUG && console.log(`Rock ${i % rocks.length}`);

    // 0.- Add 3 new lines to the grid
    for (let i = 0; i < SPAWN_Y_OFFSET; i++) grid.unshift(EMPTY_ROW);

    // 1.- Add the new block to the grid
    rock.forEach((rockRow) => grid.unshift(rockRow));
    DEBUG && printGrid('New rock added');

    while (true) {
      // 2.- Move block sideways
      const newRockHeight = rockHeights[i % rockHeights.length];
      // calculate offset for when the rock falls behind the highest point in the grid
      const newRockOffset = grid.indexOf(grid.find((row) => row.some((cell) => cell === 'O')));

      const newRock = grid.slice(newRockOffset, newRockHeight + newRockOffset);
      const displacedRock = gasMovements[gasMovementCounter % gasMovements.length] === '<'
        ? moveRockLeft(newRock, i)
        : moveRockRight(newRock, i);
      gasMovementCounter++;

      for (let i = newRockHeight - 1; i >= 0; i--) {
        grid[i + newRockOffset] = displacedRock[i];
      };

      DEBUG && printGrid(`Moved block sideways ${gasMovements[(gasMovementCounter - 1) % gasMovements.length]}`);

      // 3.- Move block down
      const toDisplaceRow = grid[newRockHeight + newRockOffset]; // used to check if the row below is empty
      const toDisplaceRowSecond = grid[newRockHeight + newRockOffset - 1];  // extra check for rock 1

      const newMovedRock = grid.slice(newRockOffset, newRockHeight + newRockOffset);

      const canMoveRockDown =
        (grid.length > (newRockHeight + newRockOffset)) &&
        (newMovedRock[newRockHeight - 1].every((cell, i) => cell === 'O' ? toDisplaceRow[i] === '.' : true)) &&
        // special case for rock 1
        (((i % rocks.length) === 1) ? newMovedRock[newRockHeight - 2].every((cell, i) => cell === 'O' ? toDisplaceRowSecond[i] !== '#' : true) : true);

      if (canMoveRockDown) {
        DEBUG && console.log('can move down');

        for (let i = newRockHeight - 1; i >= 0; i--) {
          const prevRow = grid[i + newRockOffset].map((cell) => cell === 'O' ? '.' : cell);
          const toAddRow = newMovedRock[i].map((cell) => cell === '#' ? '.' : cell);
          const mergedRow = toAddRow.map((cell, index) => cell === '.' && grid[i + 1 + newRockOffset][index] === '#' ? '#' : cell);
          grid[i + 1 + newRockOffset] = mergedRow;
          grid[i + newRockOffset] = prevRow;
        };

        // empty top rows
        let firstRow = grid[0];
        while (firstRow.every((cell) => cell === '.')) {
          grid.shift();
          firstRow = grid[0];
        }

        DEBUG && printGrid('Moved block down');
      } else {
        break;
      }
    }
    // finish: change 'O's to '#'
    const newRockOffset = grid.indexOf(grid.find((row) => row.some((cell) => cell === 'O')));
    for (let i = 0; i < (newRockOffset === 0 ? Math.min(grid.length, 4) : newRockOffset + 4); i++) {
      grid[i] = grid[i].map((cell) => cell === 'O' ? '#' : cell);
    }
    sizes.set(i + 1, grid.length);
  };
  return sizes;
};

const sizes = buildNewGrid(10000);
console.log('Grid built');

const MAX_REPEATING_SIZE = 3000;
const resultSet = new Set<number>(); 
const getNumericIncreaseInfo = (num: number = 1) => {
  for (let i = num; i <= sizes.size; i++) {
    for (let sliceSize = 10; sliceSize < MAX_REPEATING_SIZE; sliceSize++) {
      const increases = [];
      for (let u = 1; u <= 5; u++) {
        increases.push(sizes.get(i + sliceSize * u) - sizes.get(i + sliceSize * (u - 1)));
      }
      if (increases.every((increase) => increase === increases[0])) {
        const [patternLines, patternBlocks, rocksForOffset] = [increases[0], sliceSize, i];
        const otherSizes = buildNewGrid(rocksForOffset);
        const offsetSectionSize = otherSizes.get(otherSizes.size);

        const result = ((ROCKS_TO_FALL - rocksForOffset) / patternBlocks) * patternLines + offsetSectionSize;
        if (!result.toString().includes('.')) {
          if (!resultSet.has(result)) console.log(result);
          resultSet.add(result);
        }
      }
    }
  }
};
getNumericIncreaseInfo(10);
const results = Array.from(resultSet);
results.sort((a, b) => b - a);
console.log(results);
