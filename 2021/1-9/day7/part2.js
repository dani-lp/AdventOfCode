const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split(',').map(el => parseInt(el));

const MIN_VAL = Math.min(...input);
const MAX_VAL = Math.max(...input);

const getFuelCost = diff => {
    let total = 0;
    for (let i = 1; i <= diff; i++) {
        total += i;
    }
    return total;
}

const values = [];
for (let i = MIN_VAL; i <= MAX_VAL; i++) {
    values[i] = 0;
    input.forEach(el => {
        values[i] += getFuelCost(Math.abs(el - i));
    });
}

const minVal = Math.min(...values);

console.log(`Result: ${minVal}`);