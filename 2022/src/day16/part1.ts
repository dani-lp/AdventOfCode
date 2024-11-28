console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
const MAX_MINUTES = 30;

type Valve = {
  name: string;
  flowRate: number;
  neighbors: Valve[];
  open: boolean;
  index: number; // for Floyd-Warshall
};

// functions
const printDistanceMatrix = (distanceMatrix: number[][]) => {
  const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  console.log('   ', names.join(' '));
  console.log('');
  distanceMatrix.forEach((row, i) => console.log(names[i], ' ', row.map((cell) => cell === Infinity ? '∞' : cell).join(' ')));
}

// parsing
const tunnelMap = new Map<string, string[]>();  // valve name - valve neighbors
const valves: Valve[] = input.map((valve, i) => {
  const splitData = valve.split(' ');
  const name = splitData[1];
  const flowRate = parseInt(splitData[4].split('=')[1].split(';')[0]);
  const tunnels = splitData.splice(9, splitData.length).map((tunnel) => tunnel.split(',')[0]);
  tunnelMap.set(name, tunnels);
  const valveObj: Valve = {
    name,
    flowRate,
    neighbors: [],
    open: false,
    index: i
  };
  return valveObj;
});
valves.forEach((valve) => {
  const neighbors: Valve[] = tunnelMap.get(valve.name).map((tunnel) =>
    valves.find((valve) => valve.name === tunnel));
  valve.neighbors = neighbors;
});

// algorithm

// overall idea:
// 1.- Precompute distances between nodes with flow rate > 0
// 2.- Calculate all permutations
// 3.- Calculate score for each permutation
// 4.- Return max score

// using Floyd-Warshall algorithm
const valveNames = valves.map((valve) => valve.name);
const distanceMatrix: number[][] = Array(valveNames.length).fill(null).map(() => Array(valveNames.length).fill(Infinity));
for (let i = 0; i < valveNames.length; i++) {
  for (let j = 0; j < valveNames.length; j++) {
    const valve1 = valves[i];
    const valve2 = valves[j];
    if (i === j) {
      distanceMatrix[i][j] = 0;
    } else if (tunnelMap.get(valve1.name).includes(valve2.name)) {
      distanceMatrix[i][j] = 1;
    }
  }
}
for (let k = 0; k < valveNames.length; k++) {
  for (let i = 0; i < valveNames.length; i++) {
    for (let j = 0; j < valveNames.length; j++) {
      distanceMatrix[i][j] = Math.min(distanceMatrix[i][j], distanceMatrix[i][k] + distanceMatrix[k][j]);
    }
  }
}
// printDistanceMatrix(distanceMatrix);

const getPathScore = (path: string[]): number => {
  let score = 0;
  let minute = 0;
  let currentValve = valves.find((valve) => valve.name === 'AA');
  path.forEach((valveName, i) => {
    const valve = valves.find((valve) => valve.name === valveName);
    const distance = distanceMatrix[currentValve.index][valve.index];
    minute += distance + 1;
    if (minute > MAX_MINUTES) {
      return;
    }
    score += valve.flowRate * (MAX_MINUTES - minute);
    currentValve = valve;
  });
  return score;
};

let maxScore = 0;

const permutations = (permutation: string[]) => {
  let length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      
      const score = getPathScore(permutation.slice());
      if (score > maxScore) {
        maxScore = score;
        console.log(maxScore);
        
      }
    } else {
      c[i] = 0;
      ++i;
    }
  }
}

// calculate all permutation result with some useful sorting beforehand
const closedValveNames = valves
  .filter((valve) => !valve.open && valve.flowRate > 0)
  .sort((a, b) => b.flowRate - a.flowRate);
permutations(closedValveNames.map(v => v.name));

// solution
const result = maxScore;
console.assert(result === 1651, `Expected 1651, got ${result}`);