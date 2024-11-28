const fs = require('fs');
const filename = 'input.txt';

const input = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

const intInput = input.split('\n').map(el => parseInt(el));

let increaseCount = 0;
let windowA = 0;
let windowB = 0;

for (let i = 0; i < intInput.length - 3; i++) {
    windowA += intInput[i] + intInput[i + 1] + intInput[i + 2];
    windowB += intInput[i + 1] + intInput[i+2] + intInput[i + 3];

    if (windowB > windowA) increaseCount++;
    windowA = 0;
    windowB = 0;
}

console.log('Total increases:', increaseCount);