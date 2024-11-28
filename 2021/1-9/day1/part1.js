const fs = require('fs');
const filename = 'input.txt';

const input = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

const intInput = input.split('\n').map(el => parseInt(el));

let baseDepth = intInput[0];
let increaseCount = 0;

intInput.forEach(el => {
    if (el > baseDepth) {
        increaseCount++;
    }
    baseDepth = el;
});

console.log('Total increases:', increaseCount);