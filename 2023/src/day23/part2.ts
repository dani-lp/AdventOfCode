import { assertResult, readInput } from "../utils";

const map = readInput({ test: false, split: true, clear: true }).map((row) =>
  row.split(""),
);

const printMap = (map: string[][]) =>
  console.log(map.map((row) => row.join("")).join("\n"));

type Node = {
  row: number;
  col: number;
};

const start: Node = {
  row: 0,
  col: 1,
};
const end: Node = {
  row: map.length - 1,
  col: map[0].length - 2,
};

const allNodes: Node[] = [];

for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[row].length; col++) {
    const type = map[row][col];

    if (type !== "#") {
      map[row][col] = ".";
      allNodes.push({
        row,
        col,
      });
    }
  }
}
const initial = Array.from(allNodes.values()).find(
  (node) => node.row === start.row && node.col === start.col,
);
const final = Array.from(allNodes.values()).find(
  (node) => node.row === end.row && node.col === end.col,
);

const getCopyMap = (map: string[][]) => map.map((row) => row.slice());

if (!initial || !final) {
  throw new Error("Initial or final nodes not found");
}

type Edge = {
  from: Node;
  to: Node;
  weight: number;
};

type Graph = {
  nodes: Node[];
  edges: Edge[];
};

const getNeighbors = (node: Node, unvisited: Node[], map: string[][]) => {
  const getNeighbor = (row: number, col: number) =>
    unvisited.find((node) => node.row === row && node.col === col);

  const { row, col } = node;

  const neighbors = [
    getNeighbor(row + 1, col),
    getNeighbor(row - 1, col),
    getNeighbor(row, col + 1),
    getNeighbor(row, col - 1),
  ]
    .filter((neighbor) => {
      if (!neighbor) return false;
      if (map[neighbor.row][neighbor.col] === "#") return false;

      return true;
    })
    .filter(Boolean) as Node[];

  return neighbors;
};

console.log("Creating graph...");
const edgeNodes: Node[] = [initial]
  .concat(
    allNodes.filter((node) => getNeighbors(node, allNodes, map).length > 2),
  )
  .concat(final);

const allEdges: Edge[] = edgeNodes
  .map((edgeNode, i) => {
    // flooding in all directions until another is found
    const initialNeighbors = getNeighbors(edgeNode, allNodes, map);

    const paths = initialNeighbors.map((node) => {
      const path: Node[] = [edgeNode, node];

      while (true) {
        const currentNode = path[path.length - 1];
        const newNeighbors = getNeighbors(
          currentNode,
          allNodes.filter((node) => !path.includes(node)),
          map,
        );

        path.push(newNeighbors[0]);
        if (
          newNeighbors.some((newNeighbor) => edgeNodes.includes(newNeighbor))
        ) {
          break;
        }
      }

      return path;
    });

    return paths;
  })
  .flat()
  .map((path) => ({
    from: path[0],
    to: path[path.length - 1],
    weight: path.length - 1,
  }));

const edges: Edge[] = [];
allEdges.forEach((edge) => {
  if (
    edges.some(
      (storedEdge) =>
        (storedEdge.from.row === edge.to.row &&
          storedEdge.from.col === edge.to.col) ||
        (storedEdge.to.row === edge.from.row &&
          storedEdge.to.col === edge.to.col),
    )
  ) {
    return;
  }
  edges.push(edge);
});

const graph: Graph = {
  nodes: edgeNodes,
  edges: allEdges,
};
console.log("Graph created.");
console.log("");

const getGraphNeighbors = (
  node: Node,
  unvisited: Node[],
  graph: Graph,
): Node[] => {
  const destinationNodes = graph.edges
    .filter((edge) => edge.from.row === node.row && edge.from.col === node.col)
    .map((edge) => edge.to)
    .filter((toNode) => unvisited.includes(toNode));
  return destinationNodes;
};

const REAL_VALID_PATH = [
  { row: 0, col: 1 },
  { row: 5, col: 3 },
  { row: 13, col: 5 },
  { row: 19, col: 13 },
  { row: 13, col: 13 },
  { row: 3, col: 11 },
  { row: 11, col: 21 },
  { row: 19, col: 19 },
  { row: 22, col: 21 },
].map(({ row, col }) =>
  graph.nodes.find((node) => node.row === row && node.col === col),
);

let paths: Node[][] = [[graph.nodes[0]]];

console.log("Finding paths...");
while (true) {
  const newPaths: Node[][] = [];
  paths.forEach((path) => {
    const lastNode = path[path.length - 1];
    const restOfNodes = graph.nodes.filter((node) => !path.includes(node));
    const neighbors = getGraphNeighbors(lastNode, restOfNodes, graph);

    if (!neighbors.length && path[path.length - 1] === final) {
      newPaths.push([...path]);
    }

    neighbors.forEach((neighbor) => {
      newPaths.push([...path, neighbor]);
    });
  });
  paths = newPaths;
  if (newPaths.every((path) => path[path.length - 1] === final)) break;
}

const validPaths = paths.filter(
  (path) => path[0] === initial && path[path.length - 1] === final,
);
const pathLengths = validPaths.map((path) => {
  let pathLength = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];

    const edge = graph.edges.find(
      (edge) => edge.from === from && edge.to === to,
    );
    if (!edge) {
      console.error("Uh...");
    }
    pathLength += edge?.weight ?? 0;
  }
  return pathLength;
});

let max = 0;
pathLengths.forEach((length) => {
  if (length > max) max = length;
});
console.log("Total paths: ", validPaths.length);
assertResult(154, max);
