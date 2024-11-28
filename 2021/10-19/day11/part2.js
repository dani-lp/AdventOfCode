const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

const map = [];
map.push(Array(12).fill(-1));
input.forEach(line => {
    const l = [-1];
    const e = line.split('').map(el => parseInt(el));
    e.forEach(el => l.push(el));
    l.push(-1);
    map.push(l);
});
map.push(Array(12).fill(-1));


let buffer = [];
const equalArr = (arr1, arr2) => arr1[0] === arr2[0] && arr1[1] === arr2[1];
const inBuffer = arr => buffer.some(el => equalArr(el, arr));

let flashes = 0;
const flash = (x, y) => {
    map[x][y] = 0;
    flashes++;
    buffer.push([x, y]);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if ((i !== 0 || j !== 0) && map[x + i][y + j] > 0) {
                map[x + i][y + j]++;
            }
            if ((i !== 0 || j !== 0) && map[x + i][y + j] > 0) {
                if (map[x + i][y + j] > 9 && !inBuffer([x + i, y + j])) {
                    flash(x + i, y + j);
                }
            }
        }
    }
}

const allZeros = () => {
    for (let i = 1; i < map.length - 1; i++) {
        for (let j = 1; j < map[j].length - 1; j++) {
            if (map[i][j] !== 0) return false;
        }
    }
    return true;
}

let counter = 1;
while (true) {
    for (let i = 1; i < map.length - 1; i++) {
        for (let j = 1; j < map[j].length - 1; j++) {
            map[i][j]++;
        }
    }
    for (let i = 1; i < map.length - 1; i++) {
        for (let j = 1; j < map[j].length - 1; j++) {
            if (map[i][j] > 9) {
                flash(i, j);
            }
        }
    }
    buffer = [];
    if (allZeros()) break;
    else counter++;
}

console.log(`Result: ${counter}`);