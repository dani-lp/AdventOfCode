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

let steps = 0;
let found = false;
let baseNode = nodes.find((node) => node.name === "AAA")!;

while (!found) {
  const direction = directions[steps % directions.length]!;
  baseNode =
    direction === "R"
      ? nodes.find((node) => node.name === baseNode.right)!
      : nodes.find((node) => node.name === baseNode.left)!;

  if (baseNode.name === "ZZZ") {
    found = true;
  }
  steps++;
}

assertResult(2, steps);
