import { assertResult, printGrid, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const grid = input.map((row) => row.split(""));

type Node = {
  x: number;
  y: number;
  value: number;
  neighbors: Node[];
};
type Graph = Node[];

const graph: Graph = [];
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    graph.push({
      x,
      y,
      value: Number(grid[y][x]),
      neighbors: [],
    });
  }
}

// build graph
graph.forEach((node) => {
  const { x, y, value } = node;

  const neighbors = [
    { x, y: y + 1 },
    { x, y: y - 1 },
    { x: x - 1, y },
    { x: x + 1, y },
  ]
    .map(({ x, y }) => graph.find((node) => node.x === x && node.y === y))
    .filter(Boolean)
    .filter((node) => {
      if (!node) return false;

      return node.value - value === 1;
    }) as Node[];

  node.neighbors = neighbors;
});

const getPathCount = (nodeA: Node, nodeB: Node, graph: Graph): number => {
  if (nodeA.value !== 0 || nodeB.value !== 9) {
    throw new Error("Invalid input nodes");
  }

  const nodeStack = new Array<Node>();

  nodeStack.push(nodeA);

  let paths = 0;
  while (nodeStack.length) {
    const firstNode = nodeStack.pop()!;

    if (firstNode.x === nodeB.x && firstNode.y === nodeB.y) {
      paths++;
    }

    for (const neighbor of firstNode.neighbors) {
      nodeStack.push(neighbor);
    }
  }
  return paths;
};

const heads = graph.filter((node) => node.value === 0);
const tails = graph.filter((node) => node.value === 9);

const result = heads
  .flatMap((head) => tails.map((tail) => getPathCount(head, tail, graph)))
  .reduce((a, b) => a + b, 0);
assertResult(81, result);
