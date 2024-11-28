import { assertResult, readInput } from "../utils";

type Node = {
  name: string;
  left: string;
  right: string;
};

const [directionsStr, nodesStr] = readInput({
  test: false,
  clear: true,
  split: false,
}).split("\n\n") as [string, string];

const directions = directionsStr.split("");
const nodes: Node[] = nodesStr.split("\n").map((node) => {
  const [name, directions] = node.split(" = ") as [string, string];
  const [left, right] = directions
    .replace("(", "")
    .replace(")", "")
    .split(", ") as [string, string];

  return {
    name,
    left,
    right,
  };
});

const baseNodes = nodes.filter((node) => node.name.endsWith("A"));

const lcm = (...arr: number[]) => {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

const baseNodeCycles = baseNodes.map((node) => {
  let currentNode: Node = node;

  let steps = 0;
  let cycleStart = 0;

  while (true) {
    const direction = directions[steps % directions.length];

    const leftNode = nodes.find((node) => node.name === currentNode.left);
    const rightNode = nodes.find((node) => node.name === currentNode.right);

    if (!leftNode || !rightNode) {
      console.error(`No nodes found! (steps: ${steps})`);
      process.exit(1);
    }

    currentNode = direction === "L" ? leftNode : rightNode;

    if (currentNode.name.endsWith("Z")) {
      if (steps !== 0) {
        console.log(
          `Cycle found for ${node.name} (steps: ${steps - cycleStart})`,
        );
        return steps + 1;
      }
    }

    steps++;
  }
});

const result = lcm(...baseNodeCycles);
assertResult(6, result);
