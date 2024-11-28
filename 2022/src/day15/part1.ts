console.clear();
console.time('Time');
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
const TARGET_Y = 2_000_000;
type Point = { x: number, y: number };
type Sensor = { position: Point, beacon: Point };

// functions
const manhattanDistance = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const beaconDistance = (sensor: Sensor) => manhattanDistance(sensor.position, sensor.beacon);
const pointToStr = (point: Point) => `${point.x},${point.y}`;
const strToPoint = (str: string) => ({ x: Number(str.split(',')[0]), y: Number(str.split(',')[1]) }) as Point;

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
const coveredPositionSet = new Set<string>();

sensors.forEach((sensor, i) => {
  const distanceToBeacon = beaconDistance(sensor);
  const { x: xPos, y: yPos } = sensor.position;

  if (Math.abs(yPos - TARGET_Y) > distanceToBeacon) return;
  const distanceToTarget = yPos - TARGET_Y;
  const lineSize = distanceToBeacon - Math.abs(distanceToTarget);

  for (let x = xPos - lineSize; x <= xPos + lineSize; x++) {
    const newPoint = { x: x, y: TARGET_Y };
    coveredPositionSet.add(pointToStr(newPoint));
  }

  console.log(i, 'completed');
});

// result
const result = Array.from(coveredPositionSet.values()).filter((pos) => {
  const point = strToPoint(pos);
  return point.y === TARGET_Y;
}).filter((pos) => {
  const point = pos;
  const sensorPositions = sensors.map((sensor) => sensor.position).map((sensor) => pointToStr(sensor));
  const beaconPositions = sensors.map((sensor) => sensor.beacon).map((beacon) => pointToStr(beacon));
  return !sensorPositions.includes(point) && !beaconPositions.includes(point);
}).length;
console.log('Part 1 solution:', result);
console.timeEnd('Time');