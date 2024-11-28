import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: true, clear: true }).map((row) =>
  "#".concat(row).concat("#").split(""),
);

type Position = {
  x: number;
  y: number;
};

type Beam = {
  position: Position;
  direction: "up" | "down" | "left" | "right";
  remove?: boolean;
};

const printLayout = (layout: string[][]) =>
  console.log(layout.map((row) => row.join("")).join("\n"));

const horizontalRow = Array.from({ length: input[0]!.length }, () => "#");
const layout = [horizontalRow].concat(input).concat([horizontalRow]);

const initialPosition: Beam = { position: { x: 0, y: 1 }, direction: "right" };
let beams: Beam[] = [initialPosition];
const energizedTiles: Set<string> = new Set();
const saveEnergizedTile = (tile: Position) =>
  energizedTiles.add(JSON.stringify(tile));
const memoizedTiles: Set<string> = new Set();

const printEnergizedTiles = () => {
  const layoutCopy = layout.map((row) => row.slice());
  Array.from(energizedTiles).forEach((tile) => {
    const pos = JSON.parse(tile) as Position;
    layoutCopy[pos.y]![pos.x] = "O";
  });
  printLayout(layoutCopy);
};

while (beams.length) {
  const newBeams: Beam[] = [];

  beams.forEach((beam) => {
    let nextTile = "";
    switch (beam.direction) {
      case "up":
        nextTile = layout[beam.position.y - 1]![beam.position.x]!;
        beam.position.y--;
        if (nextTile === "#") {
          beam.remove = true;
        } else if (nextTile === "/") {
          beam.direction = "right";
          saveEnergizedTile(beam.position);
        } else if (nextTile === "\\") {
          beam.direction = "left";
          saveEnergizedTile(beam.position);
        } else if (nextTile === "-") {
          beam.direction = "left";
          newBeams.push({
            position: { ...beam.position },
            direction: "right",
          });
          saveEnergizedTile(beam.position);
        } else {
          saveEnergizedTile(beam.position);
        }

        break;
      case "down":
        nextTile = layout[beam.position.y + 1]![beam.position.x]!;
        beam.position.y++;
        if (nextTile === "#") {
          beam.remove = true;
        } else if (nextTile === "/") {
          beam.direction = "left";
          saveEnergizedTile(beam.position);
        } else if (nextTile === "\\") {
          beam.direction = "right";
          saveEnergizedTile(beam.position);
        } else if (nextTile === "-") {
          beam.direction = "left";
          newBeams.push({
            position: { ...beam.position },
            direction: "right",
          });
          saveEnergizedTile(beam.position);
        } else {
          saveEnergizedTile(beam.position);
        }
        break;
      case "left":
        nextTile = layout[beam.position.y]![beam.position.x - 1]!;
        beam.position.x--;
        if (nextTile === "#") {
          beam.remove = true;
        } else if (nextTile === "/") {
          beam.direction = "down";
          saveEnergizedTile(beam.position);
        } else if (nextTile === "\\") {
          beam.direction = "up";
          saveEnergizedTile(beam.position);
        } else if (nextTile === "|") {
          beam.direction = "up";
          newBeams.push({
            position: { ...beam.position },
            direction: "down",
          });
          saveEnergizedTile(beam.position);
        } else {
          saveEnergizedTile(beam.position);
        }
        break;
      case "right":
        nextTile = layout[beam.position.y]![beam.position.x + 1]!;
        beam.position.x++;
        if (nextTile === "#") {
          beam.remove = true;
        } else if (nextTile === "/") {
          beam.direction = "up";
          saveEnergizedTile(beam.position);
        } else if (nextTile === "\\") {
          beam.direction = "down";
          saveEnergizedTile(beam.position);
        } else if (nextTile === "|") {
          beam.direction = "up";
          newBeams.push({
            position: { ...beam.position },
            direction: "down",
          });
          saveEnergizedTile(beam.position);
        } else {
          saveEnergizedTile(beam.position);
        }
        break;
    }
  });

  beams = beams.filter((beam) => !beam.remove).concat(newBeams);
  beams = beams
    .filter((beam, index) => {
      const _beam = JSON.stringify(beam);
      return index === beams.findIndex((obj) => JSON.stringify(obj) === _beam);
    })
    .filter(
      (beam) =>
        !Array.from(memoizedTiles).some(
          (tile) => tile === JSON.stringify(beam),
        ),
    );

  beams.forEach((beam) => memoizedTiles.add(JSON.stringify(beam)));
}

const result = energizedTiles.size;
assertResult(46, result);
