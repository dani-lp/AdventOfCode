const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');
const log = false;

let coords = input.map(el => el.split(' -> '));

const maxCoord = 1000;
let heatMap = new Array();
for (let i = 0; i < maxCoord; i++) {
    heatMap[i] = new Array(maxCoord).fill(0);
}

coords.forEach((el, index) => {
    const x1 = parseInt(el[0].split(',')[0]);
    const y1 = parseInt(el[0].split(',')[1]);
    const x2 = parseInt(el[1].split(',')[0]);
    const y2 = parseInt(el[1].split(',')[1]);

    if (x1 === x2) {
        if (y1 > y2) {
            for (let y = y1; y >= y2; y--) {
                heatMap[y][x1] += 1;
            }
        } else {
            for (let y = y1; y <= y2; y++) {
                heatMap[y][x1] += 1;
            }
        }
    } else if (y1 === y2) {
        if (x1 > x2) {
            for (let x = x1; x >= x2; x--) {
                heatMap[y1][x] += 1;
            }
        } else {
            for (let x = x1; x <= x2; x++) {
                heatMap[y1][x] += 1;
            }
        }
    } else {
        if (x1 > x2) {
            if (y1 > y2) {
                let y = y1;
                for (let x = x1; x >= x2; x--) {
                    heatMap[y][x] += 1;
                    y--;
                }
            } else {
                let y = y1;
                for (let x = x1; x >= x2; x--) {
                    heatMap[y][x] += 1;
                    y++;
                }
            }
        } else if (x1 < x2) {
            if (y1 > y2) {
                let y = y1;
                for (let x = x1; x <= x2; x++) {
                    heatMap[y][x] += 1;
                    y--;
                }
            } else {
                let y = y1;
                for (let x = x1; x <= x2; x++) {
                    heatMap[y][x] += 1;
                    y++;
                }
            }
        } else {
            console.log('ERROR');
        }
    }
});

let overlappingPoints = 0;
for (let x = 0; x < heatMap.length; x++) {
    for (let y = 0; y < heatMap[x].length; y++) {
        if (heatMap[x][y] >= 2) {
            overlappingPoints++;
        }
    }
}

console.log(`Result: ${overlappingPoints}`);