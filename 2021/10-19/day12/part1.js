const fs = require('fs');
const filename = 'testinput.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

let neighbors = {};

input.forEach(line => {
    const [a, b] = line.split('-');
    if (neighbors[a] === undefined) neighbors[a] = [];
    if (neighbors[b] === undefined) neighbors[b] = [];
    neighbors[a].push(b);
    neighbors[b].push(a);
});

const search = (buffer, cave) => {
    if (cave === 'end') return 1;
    if (buffer.includes(cave)) {
        if (cave === 'start') return 0;
        if (cave == cave.toLowerCase()) return 0;
    }
    let sum = 0;
    console.log(`${cave}-${neighbors[cave]}`);
    neighbors[cave].forEach(el => {
        sum += search(buffer, el);
    });
    return sum;
}

console.log(`Result: ${search('start')}`);