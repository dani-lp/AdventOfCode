import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: true });

type Point = {
  x: number;
  y: number;
  z: number;
};

type Brick = {
  id: string;
  shape: Point[];
};

// 1.- Parsing
let bricks: Brick[] = input.map((row, id) => {
  const [c1, c2] = row.split("~");
  const [x1, y1, z1] = c1.split(",").map((num) => Number(num));
  const [x2, y2, z2] = c2.split(",").map((num) => Number(num));

  let shape: Point[] = [];
  if (x1 !== x2) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    for (let x = minX; x <= maxX; x++) {
      shape.push({ x, y: y1, z: z1 });
    }
  } else if (y1 !== y2) {
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    for (let y = minY; y <= maxY; y++) {
      shape.push({ x: x1, y, z: z1 });
    }
  } else if (z1 !== z2) {
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);
    for (let z = minZ; z <= maxZ; z++) {
      shape.push({ x: x1, y: y1, z });
    }
  } else {
    // 1 single cube
    shape.push({ x: x1, y: y1, z: z1 });
  }

  return {
    id: id.toString(),
    shape,
  };
});

// 2.- Falling simulation
const maxSpaceX =
  Math.max(...bricks.map(({ shape }) => Math.max(...shape.map(({ x }) => x)))) +
  1;
const maxSpaceY =
  Math.max(...bricks.map(({ shape }) => Math.max(...shape.map(({ y }) => y)))) +
  1;
const maxSpaceZ =
  Math.max(...bricks.map(({ shape }) => Math.max(...shape.map(({ z }) => z)))) +
  1;

const generateSpace = (bricks: Brick[]) => {
  const space = Array.from({ length: maxSpaceZ }, () =>
    Array.from({ length: maxSpaceY }, () =>
      Array.from({ length: maxSpaceX }, () => "."),
    ),
  );

  bricks.forEach(({ id, shape }) => {
    shape.forEach(({ x, y, z }) => (space[z][y][x] = id));
  });

  return space;
};

while (true) {
  let nextBricks: Brick[] = [];
  const space = generateSpace(bricks);

  let falls = 0;
  bricks.forEach((brick) => {
    if (brick.shape.some(({ z }) => z === 1)) {
      // already at the bottom
      nextBricks.push({
        id: brick.id,
        shape: brick.shape.map((point) => ({ ...point })),
      });
      return;
    }

    const minShapeZ = Math.min(...brick.shape.map(({ z }) => z));
    const isVertical =
      new Set(brick.shape.map(({ x }) => x)).size === 1 &&
      new Set(brick.shape.map(({ y }) => y)).size === 1;

    const canFall = isVertical
      ? space[minShapeZ - 1][brick.shape[0].y][brick.shape[0].x] === "."
      : brick.shape.every(({ x, y, z }) => space[z - 1]?.[y]?.[x] === ".");
    if (canFall) {
      falls++;
      nextBricks.push({
        id: brick.id,
        shape: brick.shape.map(({ x, y, z }) => ({ x, y, z: z - 1 })),
      });
    } else {
      nextBricks.push({
        id: brick.id,
        shape: brick.shape.map((point) => ({ ...point })),
      });
    }
  });

  bricks = nextBricks;

  if (falls === 0) {
    break;
  }
}

// 3.- Calculate disintegrate-able bricks
const canDisintegrateCount = bricks
  .map(({ id }) => {
    const finalSpace = generateSpace(bricks.filter((brick) => brick.id !== id));

    let falls = 0;
    bricks.forEach((brick) => {
      if (brick.shape.some(({ z }) => z === 1)) {
        // already at the bottom
        return;
      }

      const minShapeZ = Math.min(...brick.shape.map(({ z }) => z));
      const isVertical =
        new Set(brick.shape.map(({ x }) => x)).size === 1 &&
        new Set(brick.shape.map(({ y }) => y)).size === 1;

      const canFall = isVertical
        ? finalSpace[minShapeZ - 1][brick.shape[0].y][brick.shape[0].x] === "."
        : brick.shape.every(
            ({ x, y, z }) => finalSpace[z - 1]?.[y]?.[x] === ".",
          );
      if (canFall) {
        falls++;
      }
    });

    return falls === 0;
  })
  .filter(Boolean).length;

assertResult(5, canDisintegrateCount);
