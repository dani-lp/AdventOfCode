console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
type Point = { x: number, y: number, z: number };

// parsing
const SIZE_OFFSET = 12;
const POS_OFFSET = 4;
const maxPoint = Math.max(...input.join(',').split(',').map(x => parseInt(x)));
const grid = new Array(maxPoint + SIZE_OFFSET).fill(0).map(() => new Array(maxPoint + SIZE_OFFSET).fill(0).map(() => new Array(maxPoint + SIZE_OFFSET).fill('.')));
const points: Point[] = [];
input.forEach((row) => {
  const [x, y, z] = row.split(',').map(x => parseInt(x));
  grid[x + POS_OFFSET][y + POS_OFFSET][z + POS_OFFSET] = '#';
  points.push({ x: x + POS_OFFSET, y: y + POS_OFFSET, z: z + POS_OFFSET });
});

// functions
const getSurfaceArea = (x: number, y: number, z: number, grid: string[][][]): number => {
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

const buildNewGrid = (newPoints: Point[]): string[][][] => {
  const grid = new Array(maxPoint + SIZE_OFFSET).fill(0).map(() => new Array(maxPoint + SIZE_OFFSET).fill(0).map(() => new Array(maxPoint + SIZE_OFFSET).fill('.')));

  newPoints.forEach((point) => {
    const { x, y, z } = point;
    grid[x][y][z] = '#';
  });

  return grid;
}

const buildInverseGrid = (baseGrid: string[][][]): string[][][] => {
  // copy parameter array into grid
  const grid = new Array(maxPoint + SIZE_OFFSET).fill(0).map(() => new Array(maxPoint + SIZE_OFFSET).fill(0).map(() => new Array(maxPoint + SIZE_OFFSET).fill('.')));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      for (let k = 0; k < grid[i][j].length; k++) {
        grid[i][j][k] = baseGrid[i][j][k];
      }
    }
  }

  // fill layer by layer with 0s
  // 1.- fill first layer
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j][0] = '0';
      grid[i][j][1] = '0';
    }
  }

  const hasOpenNeighbor = (x: number, y: number, z: number): boolean => {
    return grid[x + 1][y][z] === '0' ||
      grid[x - 1][y][z] === '0' ||
      grid[x][y + 1][z] === '0' ||
      grid[x][y - 1][z] === '0' ||
      grid[x][y][z + 1] === '0' ||
      grid[x][y][z - 1] === '0';
  };

  // 2.- fill if there is a 0 nearby
  // NOTE: repeat multiple times (rep) to avoid leaving squares unchecked
  for (let rep = 0; rep < 1000; rep++) {
    for (let i = 1; i < grid.length - 1; i++) {
      for (let j = 1; j < grid[i].length - 1; j++) {
        for (let k = 1; k < grid[i][j].length - 1; k++) {
          if (grid[i][j][k] === '.') {
            if (hasOpenNeighbor(i, j, k)) {
              grid[i][j][k] = '0';
            }
          }
        }
      }
    }
  }

  return grid;
};

const getAirCubesSurfaceArea = (grid: string[][][]): number => {
  const airCubes: Point[] = [];
  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[i].length - 1; j++) {
      for (let k = 1; k < grid[i][j].length - 1; k++) {
        if (grid[i][j][k] === '.') {
          airCubes.push({ x: i, y: j, z: k });
        }
      }
    }
  }
  const newGrid = buildNewGrid(airCubes);
  let surfaceAreaToRemove = 0;
  airCubes.forEach((point) => {
    const { x, y, z } = point;
    surfaceAreaToRemove += getSurfaceArea(x, y, z, newGrid);
  });
  return surfaceAreaToRemove;
};

// algorithm
let total = 0;
points.forEach((point) => {
  const { x, y, z } = point;
  total += getSurfaceArea(x, y, z, grid);
});
const newGrid = buildInverseGrid(grid);
total -= getAirCubesSurfaceArea(newGrid);

// solution
const result = total;
console.assert(result === 58, 'Expected 58, got ' + result);