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

const areNodesConnected = (nodeA: Node, nodeB: Node, graph: Graph): boolean => {
  if (nodeA.value !== 0 || nodeB.value !== 9) {
    throw new Error("Invalid input nodes");
  }

  const toDoSet = new Array<Node>();
  const doneSet = new Array<Node>();
  toDoSet.push(nodeA);

  while (toDoSet.length) {
    const firstNode = toDoSet.shift()!;
    doneSet.push(firstNode);

    for (const node of firstNode.neighbors) {
      if (node.value === 9 && node.x === nodeB.x && node.y === nodeB.y) {
        return true;
      }
      if (
        !doneSet.some(
          (doneSetNode) => doneSetNode.x === node.x && doneSetNode.y === node.y,
        ) &&
        !toDoSet.some(
          (doneSetNode) => doneSetNode.x === node.x && doneSetNode.y === node.y,
        )
      ) {
        toDoSet.push(node);
      }
    }
  }

  return false;
};

const heads = graph.filter((node) => node.value === 0);
const tails = graph.filter((node) => node.value === 9);

const result = heads
  .map((head) => {
    const matchingTails = tails.filter((tail) =>
      areNodesConnected(head, tail, graph),
    );
    return matchingTails.length;
  })
  .reduce((a, b) => a + b, 0);
assertResult(36, result);
