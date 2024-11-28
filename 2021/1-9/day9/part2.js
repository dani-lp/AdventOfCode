const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

const equalArr = (arr1, arr2) => {
    return arr1[0] === arr2[0] && arr1[1] === arr2[1];
}

const map = [];
input.forEach(line => {
    map.push(line.split(''));
});

let lowpoints = [];
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        const value = parseInt(map[i][j]);
        
        let currentlevels = [];
        try {
            currentlevels.push(parseInt(map[i+1][j]));
        } catch {}
        try {
            currentlevels.push(parseInt(map[i-1][j]));
        } catch {}
        try {
            currentlevels.push(parseInt(map[i][j+1]));
        } catch {}
        try {
            currentlevels.push(parseInt(map[i][j-1]));
        } catch {}

        currentlevels = currentlevels.filter(el => !Number.isNaN(el));

        if (currentlevels.every(el => el > value)) {
            lowpoints.push([i, j]);
        }
    }
}

let coordbuffer = [];

const inBuffer = arr => coordbuffer.some(el => equalArr(el, arr));

const validNeighbors = (x, y) => {
    const vn = [];
    try {
        const value = parseInt(map[x+1][y]);
        if (
            value === 9 ||
            inBuffer([x+1, y]) ||
            Number.isNaN(value)
        ) throw 'error';
        else {
            vn.push([x+1, y]);
            coordbuffer.push([x+1, y]);
        }
    } catch {}
    try {
        const value = parseInt(map[x-1][y]);
        if (
            value === 9 ||
            inBuffer([x-1, y]) ||
            Number.isNaN(value)
        ) throw 'error';
        else {
            vn.push([x-1, y]);
            coordbuffer.push([x-1, y]);
        }
    } catch {}
    try {
        const value = parseInt(map[x][y+1]);
        if (
            value === 9 ||
            inBuffer([x, y+1]) ||
            Number.isNaN(value)
        ) throw 'error';
        else {
            vn.push([x, y+1]);
            coordbuffer.push([x, y+1]);
        }
    } catch {}
    try {
        const value = parseInt(map[x][y-1]);
        if (
            value === 9 ||
            inBuffer([x, y-1]) ||
            Number.isNaN(value)
        ) throw 'error';
        else {
            vn.push([x, y-1]);
            coordbuffer.push([x, y-1]);
        }
    } catch {}

    return vn;
}

let debuff = 0;

const countBasin = (x, y) => {
    let vn = validNeighbors(x, y);

    if (vn.length === 0) {
        debuff++;
        return 1;
    }
    else {
        let count = vn.length;
        
        vn.forEach(el => {
            const [nx, ny] = el;
            count += countBasin(nx, ny);
        });

        return count;
    }
}

let sizes = [];
let basinsize = 0;

lowpoints.forEach(el => {
    const [x, y] = el;
    coordbuffer = [];
    basinsize = 0;
    debuff = 0;

    basinsize += countBasin(x, y);
    sizes.push(basinsize - debuff);
});

sizes = sizes.sort((a, b) => b - a);

let results = sizes.slice(0, 3);

let total = 1;
results.forEach(el => total *= el);

console.log(`Result: ${total}`);