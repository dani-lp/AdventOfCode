console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and functions
const A_CHARCODE = 'a'.charCodeAt(0);
const Z_CHARCODE = 'z'.charCodeAt(0);

type Node = {
  x: number;
  y: number;
  visited?: boolean;
}

const getNeighbors = (point: Node, unvisited: Node[], elevations: number[][]): Node[] => {
  const validNeighbor = (x: number, y: number): boolean => {
    const from = elevations[point.x][point.y];
    const to = elevations[x][y];
    if (from > to) return true;
    else return Math.abs(from - to) <= 1;
  }
  const getNeighbor = (xPos: number, yPos: number): Node =>
    unvisited.find((node) => node.x === xPos && node.y === yPos);

  const neighbors: Node[] = [];
  const { x, y } = point;
  if (x > 0 && validNeighbor(x - 1, y)) neighbors.push(getNeighbor(x - 1, y));
  if (x < elevations.length - 1 && validNeighbor(x + 1, y)) neighbors.push(getNeighbor(x + 1, y));
  if (y > 0 && validNeighbor(x, y - 1)) neighbors.push(getNeighbor(x, y - 1));
  if (y < elevations[x].length - 1 && validNeighbor(x, y + 1)) neighbors.push(getNeighbor(x, y + 1));
  return neighbors.filter(Boolean);
}

// parsing
const position: Node = { x: 0, y: 0 };
const destinationPosition: Node = { x: 0, y: 0 };
const elevations = input.map((line, i) => {
  const elevation = line.split('').map((char, j) => {
    if (char === 'S') {
      position.x = i;
      position.y = j;
      return 0;
    }
    if (char === 'E') {
      destinationPosition.x = i;
      destinationPosition.y = j;
      return Z_CHARCODE - A_CHARCODE;
    }
    return char.charCodeAt(0) - A_CHARCODE;
  });
  return elevation;
});

// algorithm: Dijsktra
// step 1: find all unvisited nodes
const unvisited = new Set<Node>();
for (let i = 0; i < elevations.length; i++) {
  for (let j = 0; j < elevations[i].length; j++) {
    unvisited.add({ x: i, y: j, visited: false });
  }
}
const initial = Array.from(unvisited.values()).find((node) => node.x === position.x && node.y === position.y);
const destination = Array.from(unvisited.values()).find((node) =>
  node.x === destinationPosition.x && node.y === destinationPosition.y);

// step 2: assign to every node a tentative distance value
const distances = new Map<Node, number>();
Array.from(unvisited.values()).forEach((node) => distances.set(node, Infinity));
distances.set(initial, 0);

let current = initial;

// step 3: set the initial node as current
while (!destination.visited) {
  // step 4: calculate tentative distances for all neighbors of current
  const neighbors = getNeighbors(current, Array.from(unvisited.values()), elevations);
  // console.assert(neighbors.length > 1, `current: ${current.x}, ${current.y}`);

  neighbors.forEach((neighbor) => {
    const tentativeDistance = distances.get(current) + 1;
    if (tentativeDistance < distances.get(neighbor)) {
      distances.set(neighbor, tentativeDistance);
    }
  });
  // step 5: mark current node as visited and remove it from unvisited
  current.visited = true;
  unvisited.delete(current);

  // step 6: select the unvisited node with the smallest tentative distance
  const distanceList = Array.from(distances.entries())
    .filter((entry) => entry[0].visited === false)
    .map((entry) => entry[1])
    .sort((a, b) => a - b);

  if (distanceList[0] === Infinity) break;

  current = Array.from(unvisited.values()).find((node) => distances.get(node) === distanceList[0]);
}


const renderer = Array(elevations.length).fill(null).map(() => Array(elevations[0].length).fill('.'));
Array.from(distances.keys()).forEach((node) => {
  if (node.visited) renderer[node.x][node.y] = '#';
});
// renderer.forEach(line => console.log(line.join(' ')));

const result = distances.get(destination);
console.assert(result === 31, 'Result should be 31 but was ' + result);