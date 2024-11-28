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

const horizontalRow = Array.from({ length: input[0]!.length }, () => "#");
const layout = [horizontalRow].concat(input).concat([horizontalRow]);

const getEnergizedCount = (initialPosition: Beam) => {
  let beams: Beam[] = [initialPosition];
  const energizedTiles: Set<string> = new Set();
  const saveEnergizedTile = (tile: Position) =>
    energizedTiles.add(JSON.stringify(tile));
  const memoizedTiles: Set<string> = new Set();

  while (beams.length) {
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
            beams.push({
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
            beams.push({
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
            beams.push({
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
            beams.push({
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

    const tilesArr = Array.from(memoizedTiles);
    beams = beams
      .filter((beam) => !beam.remove)
      .filter((beam) => {
        const beamStr = JSON.stringify(beam);
        return !tilesArr.some((tile) => tile === beamStr);
      });

    beams.forEach((beam) => memoizedTiles.add(JSON.stringify(beam)));
  }

  return energizedTiles.size;
};

const positionsToTest: Beam[] = [
  // left side
  Array.from({ length: layout.length - 2 }, (_, i) => ({
    position: { x: 0, y: i + 1 },
    direction: "right" as const,
  })),
  // right side
  Array.from({ length: layout.length - 2 }, (_, i) => ({
    position: { x: layout.length - 1, y: i + 1 },
    direction: "left" as const,
  })),
  // top side
  Array.from({ length: layout[0]!.length - 2 }, (_, i) => ({
    position: { x: i + 1, y: 0 },
    direction: "down" as const,
  })),
  // bottom side
  Array.from({ length: layout[0]!.length - 2 }, (_, i) => ({
    position: { x: i + 1, y: layout[0]!.length - 1 },
    direction: "up" as const,
  })),
].flat();

const result = Math.max(...positionsToTest.map(getEnergizedCount));
assertResult(51, result);
