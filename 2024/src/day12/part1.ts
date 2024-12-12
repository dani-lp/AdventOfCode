import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const grid = input.map((row) => row.split(""));

type Node = {
  x: number;
  y: number;
  code: string;
  visited: boolean;
  neighbors: Node[];
};

type Graph = Node[];
type Region = Node[];

const graph: Graph = [];
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    graph.push({
      x,
      y,
      code: grid[y][x],
      visited: false,
      neighbors: [],
    });
  }
}

graph.forEach((node) => {
  const { x, y, code } = node;
  const neighbors: Node[] = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ]
    .map((position) => {
      const positionCode = grid[position.y]?.[position.x];

      if (!positionCode || positionCode !== code) {
        return null;
      }

      return graph.find(
        (graphNode) => graphNode.x === position.x && graphNode.y === position.y,
      );
    })
    .filter(Boolean) as Node[];
  node.neighbors = neighbors;
});

const regions: Region[] = [];
while (graph.some((node) => !node.visited)) {
  let baseNode = graph.find((node) => !node.visited);
  if (!baseNode) break;

  const region: Region = [];
  const toDoNodes: Node[] = [];
  toDoNodes.push(baseNode);

  while (toDoNodes.length) {
    const firstNode = toDoNodes.shift()!;
    firstNode.visited = true;
    region.push(firstNode);

    const uncheckedNeighbors = firstNode.neighbors.filter(
      (neighbor) =>
        !neighbor.visited &&
        !toDoNodes.some(
          (node) => node.x === neighbor.x && node.y === neighbor.y,
        ),
    );
    for (const neighbor of uncheckedNeighbors) {
      toDoNodes.push(neighbor);
    }
  }

  regions.push(region);
}

const getRegionArea = (region: Region): number => {
  return region.length;
};

const getRegionPerimeter = (region: Region): number => {
  let perimeter = 0;
  region.forEach((node) => {
    const { x, y, code } = node;

    const neighbors = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ].filter((position) => {
      const positionCode = grid[position.y]?.[position.x];

      return !positionCode || positionCode !== code;
    });

    perimeter += neighbors.length;
  });

  return perimeter;
};

const result = regions
  .map((region) => {
    const area = getRegionArea(region);
    const perimeter = getRegionPerimeter(region);

    return area * perimeter;
  })
  .reduce((a, b) => a + b, 0);
assertResult(1930, result);
