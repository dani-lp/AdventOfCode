import { assertResult, readInput } from "../utils";

const map = readInput({ test: false, split: true, clear: true }).map((row) =>
  row.split(""),
);

const printMap = (map: string[][]) =>
  console.log(map.map((row) => row.join("")).join("\n"));

type Position = {
  row: number;
  col: number;
};

type Type = "." | ">" | "<" | "^" | "v";

type Node = Position & {
  type: string;
};

const start: Position = {
  row: 0,
  col: 1,
};
const end: Position = {
  row: map.length - 1,
  col: map[0].length - 2,
};

const unvisited: Node[] = [];

for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[row].length; col++) {
    const type = map[row][col];

    if (type !== "#") {
      unvisited.push({
        row,
        col,
        type,
      });
    }
  }
}
const initial = Array.from(unvisited.values()).find(
  (node) => node.row === start.row && node.col === start.col,
);
const final = Array.from(unvisited.values()).find(
  (node) => node.row === end.row && node.col === end.col,
);

if (!initial || !final) {
  throw new Error("Initial or final nodes not found");
}

// max possible distances to each node

const getNeighbors = (
  node: Node,
  unvisited: Node[],
  map: string[][],
): Node[] => {
  const getNeighbor = (row: number, col: number) =>
    Array.from(unvisited.values()).find(
      (node) => node.row === row && node.col === col,
    );

  const { row, col, type } = node;

  const neighbors = [
    ...([".", "v"].includes(type) ? [getNeighbor(row + 1, col)] : []),
    ...([".", "^"].includes(type) ? [getNeighbor(row - 1, col)] : []),
    ...([".", ">"].includes(type) ? [getNeighbor(row, col + 1)] : []),
    ...([".", "<"].includes(type) ? [getNeighbor(row, col - 1)] : []),
  ]
    .filter((neighbor) => {
      if (!neighbor) return false;
      if (map[neighbor.row][neighbor.col] === "#") return false;

      return true;
    })
    .filter(Boolean) as Node[];

  return neighbors;
};

type Path = {
  head: Node[];
  length: number;
};

let paths: Path[] = [{ head: [initial], length: 0 }];
let it = 0;
while (true) {
  const DEBUG = it++ % 100 === 0;

  const newPaths: Path[] = [];
  DEBUG && console.time("get neighbors");
  paths.forEach((path) => {
    const lastNode = path.head[path.head.length - 1];
    const restOfNodes = unvisited.filter((node) => !path.head.includes(node));
    const neighbors = getNeighbors(lastNode, restOfNodes, map);

    neighbors.forEach((neighbor) => {
      newPaths.push({
        length: path.length + 1,
        head: [path.head[path.head.length - 1], neighbor],
      });
    });
  });
  DEBUG && console.timeEnd("get neighbors");

  DEBUG && console.time("filtering");
  if (newPaths.every((path) => path.head[path.head.length - 1] === final))
    break;
  else if (newPaths.some((path) => path.head[path.head.length - 1] === final)) {
    paths = newPaths.filter(
      (path) => path.head[path.head.length - 1] !== final,
    );
  } else {
    paths = newPaths;
  }
  DEBUG && console.timeEnd("filtering");
  DEBUG && console.log("");

  if (DEBUG) {
    const copyMap = map.map((row) => row.slice());
    paths
      .flat()
      .map((path) => path.head)
      .flat()
      .forEach(({ row, col }) => (copyMap[row][col] = "O"));
    printMap(copyMap);
    console.log("");
  }
}

const lengths = paths.map((path) => path.length);
console.log(lengths);
const result = Math.max(...lengths) + 1;
assertResult(94, result);
