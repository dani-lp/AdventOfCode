const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

let counter = 0;
input.forEach(el => {
    const entry = el.split(' | ')[1].split(' ');
    entry.forEach(dig => {
        if (dig.length == 2 || dig.length == 3 || dig.length == 4 || dig.length == 7) counter++;
    });
});

console.log(`Result: ${counter}`);