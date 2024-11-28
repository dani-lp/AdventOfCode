const fs = require('fs');
const filename = 'input.txt';

const input = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});
const prInput = input.split('\n').map(el => el.slice(0, -1));
prInput.pop();

let position = 0;
let depth = 0;
let aim = 0;

prInput.forEach(el => {
    const splitted = el.split(' ');
    const value = parseInt(splitted[1]);
    switch (splitted[0]) {
        case 'forward':
            position += value;
            depth += aim * value;
            break;
        case 'up':
            aim -= value;
            break;
        case 'down':
            aim += value;
            break;
        default:
            console.log('error');
            break;
    }
});

console.log('Result: ' + (position * depth));