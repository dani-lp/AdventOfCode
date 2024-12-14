import { assertResult, readInput } from "../utils";

const TEST = false;
const input = readInput({ test: TEST, split: true });
console.clear();

type Position = {
  x: number;
  y: number;
};

type Robot = {
  px: number;
  py: number;
  vx: Readonly<number>;
  vy: Readonly<number>;
};

const SECONDS = 100;
const FIELD_SIZE: Position = TEST ? { x: 11, y: 7 } : { x: 101, y: 103 };
const robots: Robot[] = input.map((row) => {
  const [position, velocity] = row.split(" ").map((r) => r.slice(2));
  const [px, py] = position.split(",");
  const [vx, vy] = velocity.split(",");

  return {
    px: Number(px),
    py: Number(py),
    vx: Number(vx),
    vy: Number(vy),
  };
});

const printMap = (robots: Robot[]): void => {
  for (let y = 0; y < FIELD_SIZE.y; y++) {
    let row = "";
    for (let x = 0; x < FIELD_SIZE.x; x++) {
      const robotCount = robots.filter((r) => r.px === x && r.py === y).length;
      if (robotCount > 0) row += robotCount;
      else row += ".";
    }
    console.log(row);
  }
};

const moveRobots = (robots: Robot[]) => {
  for (let s = 0; s < SECONDS; s++) {
    robots.forEach((robot) => {
      const { px, py, vx, vy } = robot;
      let nextX = px + vx;
      let nextY = py + vy;

      if (nextX < 0) nextX += FIELD_SIZE.x;
      nextX %= FIELD_SIZE.x;

      if (nextY < 0) nextY += FIELD_SIZE.y;
      nextY %= FIELD_SIZE.y;

      robot.px = nextX;
      robot.py = nextY;
    });
  }
};

const getSafetyFactor = (robots: readonly Robot[]): number => {
  let q1 = 0;
  let q2 = 0;
  let q3 = 0;
  let q4 = 0;

  const middleRow = Math.floor(FIELD_SIZE.x / 2);
  const middleColumn = Math.floor(FIELD_SIZE.y / 2);

  robots.forEach((robot) => {
    const { px, py } = robot;

    if (px < middleRow && py < middleColumn) q1++;
    else if (px > middleRow && py < middleColumn) q2++;
    else if (px < middleRow && py > middleColumn) q3++;
    else if (px > middleRow && py > middleColumn) q4++;
  });

  return q1 * q2 * q3 * q4;
};

moveRobots(robots);

const result = getSafetyFactor(robots);
assertResult(12, result);
