import { assertResult, printGrid, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const START = "S";
const END = "E";

const grid = input.map((r) => r.split(""));

type Position = {
  x: number;
  y: number;
};

type Node = Position & {
  neighbors: Node[];
  visited: boolean;
};

type Graph = Node[];

const startPosition: Position = { x: -1, y: -1 };
const endPosition: Position = { x: -1, y: -1 };
const graph: Graph = [];
for (let y = 1; y < grid.length - 1; y++) {
  for (let x = 1; x < grid[y].length - 1; x++) {
    const gridChar = grid[y][x];
    if (gridChar !== "#") {
      graph.push({ x, y, neighbors: [], visited: false });
    }
    if (gridChar === START) {
      startPosition.x = x;
      startPosition.y = y;
    } else if (gridChar === END) {
      endPosition.x = x;
      endPosition.y = y;
    }
  }
}
const startNode = graph.find(
  (node) => node.x === startPosition.x && node.y === startPosition.y,
)!;
const endNode = graph.find(
  (node) => node.x === endPosition.x && node.y === endPosition.y,
)!;

graph.forEach((node) => {
  const { x, y } = node;
  [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ].forEach((position) => {
    const gridChar = grid[y]?.[x];
    if (gridChar === "#") {
      return;
    }
    const neighbor = graph.find(
      (node) => node.x === position.x && node.y === position.y,
    );
    if (!neighbor) {
      return;
    }
    node.neighbors.push(neighbor);
  });
});

const dijskstra = () => {
  // Define possible directions: right (0), down (1), left (2), up (3)
  const DIRECTIONS = [
    { dx: 1, dy: 0 }, // Right
    { dx: 0, dy: 1 }, // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: -1 }, // Up
  ];

  const TURN_PENALTY = 1000; // Significant penalty for changing direction

  // Create a unique key for each node-direction combination
  const createNodeKey = (node: Node, direction: number) =>
    `${node.x},${node.y},${direction}`;

  // Track visited and distances for each node-direction combination
  const unvisitedSet = new Set<string>();
  const distances = new Map<string, number>();

  // Initialize start node
  graph.forEach((node) => {
    DIRECTIONS.forEach((_, directionIndex) => {
      const nodeKey = createNodeKey(node, directionIndex);
      if (node === startNode && directionIndex === 0) {
        // Start facing right with zero distance
        distances.set(nodeKey, 0);
      } else {
        distances.set(nodeKey, Infinity);
      }
      unvisitedSet.add(nodeKey);
    });
  });

  // Find the initial current node key (start node facing right)
  let currentNodeKey = createNodeKey(startNode, 0);

  while (true) {
    const currentNode = graph.find(
      (node) =>
        node.x === parseInt(currentNodeKey.split(",")[0]) &&
        node.y === parseInt(currentNodeKey.split(",")[1]),
    )!;
    const currentDirection = parseInt(currentNodeKey.split(",")[2]);

    currentNode.neighbors.forEach((neighbor) => {
      const dx = neighbor.x - currentNode.x;
      const dy = neighbor.y - currentNode.y;

      const newDirectionIndex = DIRECTIONS.findIndex(
        (dir) => dir.dx === dx && dir.dy === dy,
      );

      const currentDistance = distances.get(currentNodeKey)!;
      let tentativeDistance = currentDistance + 1;
      if (newDirectionIndex !== currentDirection) {
        tentativeDistance += TURN_PENALTY;
      }
      const neighborKey = createNodeKey(neighbor, newDirectionIndex);
      const existingNeighborDistance = distances.get(neighborKey) ?? Infinity;
      if (tentativeDistance < existingNeighborDistance) {
        distances.set(neighborKey, tentativeDistance);
      }
    });

    unvisitedSet.delete(currentNodeKey);

    const eligibleDistances = Array.from(distances.entries())
      .filter(([key]) => unvisitedSet.has(key))
      .map(([key, distance]) => ({ key, distance }))
      .sort((a, b) => a.distance - b.distance);

    if (
      eligibleDistances.length === 0 ||
      eligibleDistances[0].distance === Infinity
    )
      break;

    currentNodeKey = eligibleDistances[0].key;
  }

  const finalDistances = new Map<Node, number>();
  graph.forEach((node) => {
    const nodeDistances = Array.from(distances.entries())
      .filter(([key]) => key.startsWith(`${node.x},${node.y},`))
      .map(([, distance]) => distance);

    finalDistances.set(node, Math.min(...nodeDistances));
  });

  return finalDistances;
};

const distances = dijskstra();
const result = distances.get(endNode);
assertResult(11048, result);
