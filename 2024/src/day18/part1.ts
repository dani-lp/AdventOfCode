import { assertResult, readInput } from "../utils";

const TEST = false;
const input = readInput({ test: TEST, split: true });
console.clear();

type Position = {
  x: number;
  y: number;
};

type Node = Position & {
  neighbors: Node[];
  visited: boolean;
};

const MIN_SIZE = 0;
const MAX_SIZE = TEST ? 7 : 71;
const FALLING_BYTES = TEST ? 12 : 1024;

const endPosition: Position = {
  x: MAX_SIZE,
  y: MAX_SIZE,
};

const bytes: Position[] = input.slice(0, FALLING_BYTES).map((byte) => {
  const [x, y] = byte.split(",").map(Number);
  return { x, y };
});

const printBytes = () => {
  for (let y = 0; y < MAX_SIZE; y++) {
    let row = "";
    for (let x = 0; x < MAX_SIZE; x++) {
      if (bytes.some((byte) => byte.x === x && byte.y === y)) {
        row += "#";
      } else {
        row += ".";
      }
    }
    console.log(row);
  }
};

const graph: Node[] = [];
for (let y = 0; y < MAX_SIZE; y++) {
  for (let x = 0; x < MAX_SIZE; x++) {
    if (!bytes.some((byte) => byte.x === x && byte.y === y)) {
      graph.push({ x, y, neighbors: [], visited: false });
    }
  }
}

graph.forEach((node) => {
  const { x, y } = node;
  const neighboringPositions: Position[] = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ]
    .filter(({ x, y }) => x >= 0 && x < MAX_SIZE && y >= 0 && y < MAX_SIZE)
    .filter(({ x, y }) => !bytes.some((byte) => byte.x === x && byte.y === y));

  node.neighbors = neighboringPositions
    .map(
      (position) =>
        graph.find((node) => node.x === position.x && node.y === position.y)!,
    )
    .filter(Boolean);
});

const dijkstra = () => {
  const unvisited = new Set<Node>();
  graph.forEach((node) => unvisited.add(node));

  const initial = Array.from(unvisited.values()).find(
    (node) => node.x === 0 && node.y === 0,
  );
  const destination = Array.from(unvisited.values()).find(
    (node) => node.x === MAX_SIZE - 1 && node.y === MAX_SIZE - 1,
  );
  if (!initial || !destination) throw new Error("Base nodes not found");

  const distances = new Map<Node, number>();
  Array.from(unvisited.values()).forEach((node) =>
    distances.set(node, Infinity),
  );
  distances.set(initial, 0);

  let current = initial;

  while (!destination.visited) {
    current.neighbors.forEach((neighbor) => {
      const tentativeDistance = distances.get(current)! + 1;
      if (tentativeDistance < distances.get(neighbor)!) {
        distances.set(neighbor, tentativeDistance);
      }
    });

    current.visited = true;
    unvisited.delete(current);

    const distanceList = Array.from(distances.entries())
      .filter((entry) => entry[0].visited === false)
      .map((entry) => entry[1])
      .sort((a, b) => a - b);

    if (distanceList[0] === Infinity) break;

    current = Array.from(unvisited.values()).find(
      (node) => distances.get(node) === distanceList[0],
    )!;
  }

  return distances.get(destination);
};

const result = dijkstra();
assertResult(22, result);
