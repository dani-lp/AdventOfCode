console.clear();
console.time('Time');
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
const MIN_COORD = 0;
const MAX_COORD = 4_000_000;
type Point = { x: number, y: number };
type Sensor = { position: Point, beacon: Point };
type Square = {
  center: Point,
  distanceToBeacon: number,
};

// functions
const manhattanDistance = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const beaconDistance = (sensor: Sensor) => manhattanDistance(sensor.position, sensor.beacon);
const pointToStr = (point: Point) => `${point.x},${point.y}`;
const strToPoint = (str: string) => ({ x: Number(str.split(',')[0]), y: Number(str.split(',')[1]) }) as Point;
const getTuningFrequency = (distressBeacon: Point) => distressBeacon.x * MAX_COORD + distressBeacon.y;
const pointInRange = (point: Point): boolean => {
  return point.x >= MIN_COORD && point.x <= MAX_COORD && point.y >= MIN_COORD && point.y <= MAX_COORD;
};
const isPointInSquare = (point: Point, square: Square): boolean => {
  const xDistanceToTarget = point.x - square.center.x;
  const yDistanceToTarget = point.y - square.center.y;
  const xLineSize = square.distanceToBeacon - Math.abs(xDistanceToTarget);
  const yLineSize = square.distanceToBeacon - Math.abs(yDistanceToTarget);

  const result = Math.abs(point.x - square.center.x) <= yLineSize
    && Math.abs(point.y - square.center.y) <= xLineSize;

  return result;
};

// parsing
const sensors = input.map((line) => {
  const lineArr = line.split(' ');
  const xPosition = Number(lineArr[2].slice(2, -1));
  const yPosition = Number(lineArr[3].slice(2, -1));
  const xBeacon = Number(lineArr[8].slice(2, -1));
  const yBeacon = Number(lineArr[9].slice(2));

  return {
    position: { x: xPosition, y: yPosition },
    beacon: { x: xBeacon, y: yBeacon },
  } as Sensor;
});

// algorithm
const squares: Square[] = sensors.map((sensor) => {
  const distanceToBeacon = beaconDistance(sensor);
  return { center: sensor.position, distanceToBeacon };
});

// idea: follow along edges of squares, and check if each point belongs to another square
const points: string[] = [];
squares.forEach((square) => {
  const { x: xPos, y: yPos } = square.center;
  const { distanceToBeacon } = square;

  const topCorner = { x: xPos, y: yPos - distanceToBeacon };
  const bottomCorner = { x: xPos, y: yPos + distanceToBeacon };
  const leftCorner = { x: xPos - distanceToBeacon, y: yPos };
  const rightCorner = { x: xPos + distanceToBeacon, y: yPos };

  // iterate along top-right
  for (let x = topCorner.x, y = topCorner.y + 1; x <= rightCorner.x + 1; x++, y++) {
    const point: Point = { x, y };
    const found = squares.every((square) => !isPointInSquare(point, square));
    if (found) {
      points.push(pointToStr(point));
      break;
    }
  }

  // iterate along right-bottom
  for (let x = rightCorner.x + 1, y = rightCorner.y; y <= bottomCorner.y + 1; x--, y++) {
    const point: Point = { x, y };
    const found = squares.every((square) => !isPointInSquare(point, square));
    if (found) {
      points.push(pointToStr(point));
      break;
    }
  }

  // iterate along bottom-left
  for (let x = bottomCorner.x, y = bottomCorner.y + 1; x >= bottomCorner.x - 1; x--, y--) {
    const point: Point = { x, y };
    const found = squares.every((square) => !isPointInSquare(point, square));
    if (found) {
      points.push(pointToStr(point));
      break;
    }
  }

  // iterate along left-top
  for (let x = leftCorner.x - 1, y = leftCorner.y; x >= topCorner.y - 1; x++, y--) {
    const point: Point = { x, y };
    const found = squares.every((square) => !isPointInSquare(point, square));
    if (found) {
      points.push(pointToStr(point));
      break;
    }
  }
});

const point = points.find((point) => {
  const pointObj = strToPoint(point);
  return pointInRange(pointObj);
});

const result = getTuningFrequency(strToPoint(point));
console.assert(result === 56000011, `Wrong result: ${result} != 56000011`);
console.timeEnd('Time');