/** Solved "visually" with neato/graphviz. */

import { readInput } from "../utils";
import fs from "fs";

type Node = {
  id: string;
  connections: Set<string>;
};

const baseNodes = readInput({
  test: false,
  split: true,
  clear: true,
}).map((row) => {
  const [id, rawConnections] = row.split(": ");
  const connections = rawConnections.split(" ");
  return {
    id,
    connections,
  };
});

const nodeNames = new Set<string>();
baseNodes.forEach(({ id, connections }) => {
  nodeNames.add(id);
  connections.forEach((c) => nodeNames.add(c));
});

const nodes: Node[] = Array.from(nodeNames.values()).map((id) => ({
  id,
  connections: new Set<string>(),
}));
nodes.forEach(({ id, connections }) => {
  const baseNode = baseNodes.find((baseNode) => baseNode.id === id);
  baseNode?.connections.forEach((c) => connections.add(c));

  const otherNeighbors = baseNodes
    .filter((baseNode) => baseNode.connections.includes(id))
    .map((baseNode) => baseNode.id);
  otherNeighbors.forEach((neighbor) => connections.add(neighbor));
});

type Edge = {
  a: string;
  b: string;
};

const edges: Edge[] = [];
nodes.forEach((node) => {
  const newEdges: Edge[] = Array.from(node.connections.values())
    .map((connection) => ({ a: node.id, b: connection }))
    .filter(({ a, b }) => !edges.some((edge) => edge.a === b && edge.b === a));
  edges.push(...newEdges);
});

edges.forEach((edge) => {
  const str = `${edge.a} -- ${edge.b};\n`;
  fs.appendFileSync("test.txt", str);
});

const getEdgesCopy = (edges: Edge[]): Edge[] =>
  edges.map(({ a, b }) => ({ a, b }));

const getGraphCopy = (graph: readonly Node[]): Node[] =>
  graph.map((node) => ({
    id: node.id,
    connections: new Set(node.connections),
  }));

const getThreeRandomIndexes = (length: number) => {
  const getRandomNumber = () => Math.floor(Math.random() * length);
  const num1 = getRandomNumber();
  let num2;
  let num3;

  do {
    num2 = getRandomNumber();
  } while (num2 === num1);
  do {
    num3 = getRandomNumber();
  } while (num3 === num1 || num3 === num2);

  return [num1, num2, num3];
};

const getGraphNodes = (
  graph: readonly Node[],
  startingNode?: Node,
): Set<string> => {
  const visited = new Set<string>();
  const start = startingNode ?? graph[0];
  const queue = [start];

  while (queue.length) {
    const node = queue.shift()!;
    const neighbors: Node[] = Array.from(node.connections.values())
      .map(
        (connection) => graph.find((graphNode) => graphNode.id === connection)!,
      )
      .filter((neighbor) => !visited.has(neighbor.id));
    queue.push(...neighbors);
    visited.add(node.id);
  }

  return visited;
};

let max = 0;
for (let i = 0; i < nodes.length - 2; i++) {
  for (let j = i + 1; j < nodes.length - 1; j++) {
    for (let k = i + 2; k < nodes.length; k++) {
      max++;
    }
  }
}

const baseGraphSize = nodes.length;

// obtained with neato
const edgesToRemove: Edge[] = [
  { a: "ntx", b: "gmr" },
  { a: "gsk", b: "ncg" },
  { a: "rjs", b: "mrd" },
];

const graph = getGraphCopy(nodes);
graph.forEach(({ id, connections }) => {
  if (edgesToRemove.some((edge) => edge.a === id)) {
    const edgeToRemove = edgesToRemove.find((edge) => edge.a === id)!;
    connections.delete(edgeToRemove.b);
    graph.find((node) => node.id === edgeToRemove.b)?.connections.delete(id);
  } else if (edgesToRemove.some((edge) => edge.b === id)) {
    const edgeToRemove = edgesToRemove.find((edge) => edge.b === id)!;
    connections.delete(edgeToRemove.a);
    graph.find((node) => node.id === edgeToRemove.a)?.connections.delete(id);
  }
});

const newGraphSize = getGraphNodes(graph).size;

let result: number | null = null;
if (newGraphSize !== baseGraphSize) {
  result = (baseGraphSize - newGraphSize) * newGraphSize;
}

console.log("Result:", result);
// assertResult(54, result);
