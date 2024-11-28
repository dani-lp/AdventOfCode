import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'}).trim();
const input = rawInput.split('\n');

type Point = {
  x: number;
  y: number;
}

const [wire1, wire2] = input.map((line) => line.split(','));

const wire1Points: Point[] = [];
const wire2Points: Point[] = [];

let wire1Coordinates: Point = { x: 0, y: 0 };
wire1.forEach((movement) => {
  const direction = movement[0];
  const amount = parseInt(movement.slice(1));

  for (let i = 0; i < amount; i++) {
    wire1Points.push({ ...wire1Coordinates });

    switch(direction) {
      case 'R':
        wire1Coordinates.x += 1;
        break;
      case 'L':
        wire1Coordinates.x -= 1;
        break;
      case 'U':
        wire1Coordinates.y += 1;
        break;
      case 'D':
        wire1Coordinates.y -= 1;
        break;
    }
  }
});
console.log('Wire 1 complete');

let wire2Coordinates: Point = { x: 0, y: 0 };
wire2.forEach((movement) => {
  const direction = movement[0];
  const amount = parseInt(movement.slice(1));

  for (let i = 0; i < amount; i++) {
    wire2Points.push({ ...wire2Coordinates });

    switch(direction) {
      case 'R':
        wire2Coordinates.x += 1;
        break;
      case 'L':
        wire2Coordinates.x -= 1;
        break;
      case 'U':
        wire2Coordinates.y += 1;
        break;
      case 'D':
        wire2Coordinates.y -= 1;
        break;
    }
  }
});
console.log('Wire 2 complete');

function distance(p1: Point) {
  const p2: Point = { x: 0, y: 0 };
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

const overlappingPointsDistances = wire1Points
  .filter((point) => !(point.x === 0 && point.y === 0))
  .filter((point) => wire2Points.some((p) => p.x === point.x && p.y === point.y))
  .map(distance);

const result = Math.min(...overlappingPointsDistances);

console.log('Result:', result);
