import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true });
console.clear();

const grid = input.map((row) => row.split(""));

type Direction = "up" | "down" | "right" | "left";

type Position = {
  x: number;
  y: number;
};

type DirectedPosition = Position & { direction: Direction };

type Node = Position & {
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

const getRegionPerimeterPoints = (region: Region): DirectedPosition[] => {
  const perimeterPoints = region.flatMap((node) => {
    const { x, y, code } = node;

    const neighborPoints: DirectedPosition[] = [
      { x: x + 1, y, direction: "right" },
      { x: x - 1, y, direction: "left" },
      { x, y: y + 1, direction: "down" },
      { x, y: y - 1, direction: "up" },
    ];

    const neighbors = neighborPoints.filter((position) => {
      const positionCode = grid[position.y]?.[position.x];

      return !positionCode || positionCode !== code;
    });

    return neighbors;
  });

  return perimeterPoints;
};

const getDistinctConsecutiveNumberGroups = (numbers: number[]): number => {
  const groups = numbers
    .toSorted((a, b) => a - b)
    .reduce((r, n) => {
      const lastSubArray = r[r.length - 1];

      if (!lastSubArray || lastSubArray[lastSubArray.length - 1] !== n - 1) {
        r.push([]);
      }

      r[r.length - 1].push(n);

      return r;
    }, [] as number[][]);
  return groups.length;
};

const getRegionSides = (region: Region): number => {
  const perimeterPoints = getRegionPerimeterPoints(region);

  const upGroups: Map<number, Set<number>> = new Map();
  const downGroups: Map<number, Set<number>> = new Map();
  const leftGroups: Map<number, Set<number>> = new Map();
  const rightGroups: Map<number, Set<number>> = new Map();

  // Process vertical (up/down) groups
  perimeterPoints
    .filter((obj) => obj.direction === "up")
    .forEach((obj) => {
      const group = upGroups.get(obj.y) || new Set();
      group.add(obj.x);
      upGroups.set(obj.y, group);
    });
  perimeterPoints
    .filter((obj) => obj.direction === "down")
    .forEach((obj) => {
      const group = downGroups.get(obj.y) || new Set();
      group.add(obj.x);
      downGroups.set(obj.y, group);
    });

  // Process horizontal (left/right) groups
  perimeterPoints
    .filter((obj) => obj.direction === "left")
    .forEach((obj) => {
      const group = leftGroups.get(obj.x) || new Set();
      group.add(obj.y);
      leftGroups.set(obj.x, group);
    });
  perimeterPoints
    .filter((obj) => obj.direction === "right")
    .forEach((obj) => {
      const group = rightGroups.get(obj.x) || new Set();
      group.add(obj.y);
      rightGroups.set(obj.x, group);
    });

  return [upGroups, downGroups, rightGroups, leftGroups]
    .map((group) =>
      Array.from(group.values())
        .map((set) => Array.from(set))
        .map(getDistinctConsecutiveNumberGroups)
        .reduce((a, b) => a + b, 0),
    )
    .reduce((a, b) => a + b, 0);
};

const getRegionPrice = (region: Region): number => {
  return region.length * getRegionSides(region);
};

const result = regions.map(getRegionPrice).reduce((a, b) => a + b, 0);
assertResult(1206, result);
