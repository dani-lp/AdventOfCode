console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
const TIME_TO_TEACH_ELEFANT = 4;
const MAX_MINUTES = 30 - TIME_TO_TEACH_ELEFANT;

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

const shuffle = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
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

let maxScore1 = 0;
let maxScore2 = 0;
const permutations = (permutation: string[], listNumber: 1 | 2) => {
  let length = permutation.length,
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
      if (listNumber === 1) {
        if (score > maxScore1) {
          maxScore1 = score;
          // console.log(listNumber, maxScore1);
        }
      } else {
        if (score > maxScore2) {
          maxScore2 = score;
          // console.log(listNumber, maxScore2);
        }
      }
    } else {
      c[i] = 0;
      ++i;
    }
  }
}

// calculate all permutation result with some useful sorting beforehand
const closedValves = valves
  .filter((valve) => !valve.open && valve.flowRate > 0)

let maxScore = 0;
while (true) {
  const shuffledValves = shuffle(closedValves);

  const firstHalve = shuffledValves.slice(0, shuffledValves.length / 2);
  const secondHalve = shuffledValves.slice(shuffledValves.length / 2);

  firstHalve.sort((a, b) => b.flowRate - a.flowRate);
  secondHalve.sort((a, b) => b.flowRate - a.flowRate);

  const elephantValves = firstHalve.map((valve) => valve.name);
  const humanValves = secondHalve.map((valve) => valve.name);

  permutations(elephantValves, 1);
  permutations(humanValves, 2);

  if (maxScore1 + maxScore2 > maxScore) {
    maxScore = maxScore1 + maxScore2;
    console.log('maxScore', maxScore);
  }

  maxScore1 = 0;
  maxScore2 = 0;
}

// solution
// const result = getPathScore(['DD', 'BB', 'JJ', 'HH', 'EE', 'CC']);