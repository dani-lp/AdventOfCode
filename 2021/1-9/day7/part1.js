const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split(',').map(el => parseInt(el));

const MIN_VAL = Math.min(...input);
const MAX_VAL = Math.max(...input);

const values = {};
for (let i = MIN_VAL; i <= MAX_VAL; i++) {
    values[i] = 0;
    input.forEach(el => {
        values[i] += Math.abs(el - i);
    });
}

const minVal = Math.min(...Object.values(values));

console.log(`Result: ${minVal}`);