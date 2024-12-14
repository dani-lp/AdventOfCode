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

const areAnyRobotsInLine = (robots: Robot[]): boolean => {
  const xMap = new Map<number, number>();
  const yMap = new Map<number, number>();
  robots.forEach(({ px, py }) => {
    const pxCount = xMap.get(px) ?? 0;
    const pyCount = yMap.get(py) ?? 0;
    xMap.set(px, pxCount + 1);
    yMap.set(py, pyCount + 1);
  });
  return (
    Array.from(xMap.values()).some((c) => c > 32) &&
    Array.from(yMap.values()).some((c) => c > 32)
  );
};

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
  let it = 1;
  while (true) {
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

    if (areAnyRobotsInLine(robots)) {
      printMap(robots);
      console.log(`Iteration: ${it}`);
      break;
    }

    it++;
  }
};

moveRobots(robots);
