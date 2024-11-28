import { assertResult, readInput } from "../utils";

type Hailstone = {
  px: number;
  py: number;
  vx: number;
  vy: number;
};

const TEST = false;

const hailstones: Hailstone[] = readInput({
  test: TEST,
  split: true,
  clear: true,
}).map((row) => {
  const [p, v] = row.split(" @ ");
  const [px, py] = p.split(", ");
  const [vx, vy] = v.split(", ");

  return {
    px: Number(px),
    py: Number(py),
    vx: Number(vx),
    vy: Number(vy),
  };
});

const testMinP = 7;
const testMaxP = 27;
const realMinP = 200_000_000_000_000;
const realMaxP = 400_000_000_000_000;

const minP = TEST ? testMinP : realMinP;
const maxP = TEST ? testMaxP : realMaxP;

type Segment = {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
};

const isPointInRange = (px: number, py: number, minP: number, maxP: number) =>
  px >= minP && px <= maxP && py >= minP && py <= maxP;

type LinearEquation = {
  // y = mx + b
  m: number;
  b: number;
};

const printEquation = (equation: LinearEquation) =>
  `y = ${equation.m}x + ${equation.b}`;

const linearEquations: LinearEquation[] = hailstones.map(
  ({ px, py, vx, vy }) => {
    const m = vy / vx;
    const b = -m * px + py;
    const eq: LinearEquation = {
      m,
      b,
    };
    return eq;
  },
);

type Point = {
  x: number;
  y: number;
};

const findIntersection = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
): Point | null => {
  const p1: Point = { x: x1, y: y1 };
  const p2: Point = { x: x2, y: y2 };
  const p3: Point = { x: x3, y: y3 };
  const p4: Point = { x: x4, y: y4 };

  const denominator =
    (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

  if (denominator === 0) {
    // The lines are parallel or coincident
    return null;
  }

  const ua =
    ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) /
    denominator;
  const ub =
    ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) /
    denominator;

  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    const intersectionX = p1.x + ua * (p2.x - p1.x);
    const intersectionY = p1.y + ua * (p2.y - p1.y);
    return { x: intersectionX, y: intersectionY };
  }

  return null; // Segments do not intersect within their bounds
};

type Direction = "tr" | "tl" | "br" | "bl";

let intersectionCount = 0;
for (let i = 0; i < linearEquations.length - 1; i++) {
  for (let j = i + 1; j < linearEquations.length; j++) {
    const eqA = linearEquations[i];
    const eqB = linearEquations[j];
    const eqAStone = hailstones[i];
    const eqBStone = hailstones[j];

    if (eqA.m === eqB.m) {
      continue;
    }

    const DEBUG = i === 2 && j === 4;

    const eqADirection: Direction =
      eqAStone.vy > 0
        ? eqAStone.vx > 0
          ? "tr"
          : "tl"
        : eqAStone.vx > 0
          ? "br"
          : "bl";
    const eqBDirection: Direction =
      eqBStone.vy > 0
        ? eqBStone.vx > 0
          ? "tr"
          : "tl"
        : eqBStone.vx > 0
          ? "br"
          : "bl";

    const segmentA = {
      sx: minP,
      sy: eqA.m * minP + eqA.b,
      ex: maxP,
      ey: eqA.m * maxP + eqA.b,
    };
    const segmentB = {
      sx: minP,
      sy: eqB.m * minP + eqB.b,
      ex: maxP,
      ey: eqB.m * maxP + eqB.b,
    };

    const intersection = findIntersection(
      segmentA.sx,
      segmentA.sy,
      segmentA.ex,
      segmentA.ey,
      segmentB.sx,
      segmentB.sy,
      segmentB.ex,
      segmentB.ey,
    );
    if (!intersection) continue;

    switch (eqADirection) {
      case "tr":
        if (intersection.x < eqAStone.px && intersection.y < eqAStone.py)
          continue;
        break;
      case "tl":
        if (intersection.x > eqAStone.px && intersection.y < eqAStone.py)
          continue;
        break;
      case "br":
        if (intersection.x < eqAStone.px && intersection.y > eqAStone.py)
          continue;
        break;
      case "bl":
        if (intersection.x > eqAStone.px && intersection.y > eqAStone.py)
          continue;
        break;
    }

    switch (eqBDirection) {
      case "tr":
        if (intersection.x < eqBStone.px && intersection.y < eqBStone.py)
          continue;
        break;
      case "tl":
        if (intersection.x > eqBStone.px && intersection.y < eqBStone.py)
          continue;
        break;
      case "br":
        if (intersection.x < eqBStone.px && intersection.y > eqBStone.py)
          continue;
        break;
      case "bl":
        if (intersection.x > eqBStone.px && intersection.y > eqBStone.py)
          continue;
        break;
    }

    if (isPointInRange(intersection.x, intersection.y, minP, maxP)) {
      intersectionCount++;
    }
  }
}

assertResult(2, intersectionCount);
