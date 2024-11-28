const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});
const input = rawinput.split('\n');

let meanRate = [];

input.forEach(el => {
    [...el].forEach((ch, index) => {
        if (meanRate[index] === undefined) meanRate[index] = 0;
        
        if (ch === '0') {
            meanRate[index]--;
        } else if (ch === '1') {
            meanRate[index]++;
        } else {
            console.log('Error');
        }
    });
});

gammaRate = parseInt(Number(meanRate.map(el => parseInt(el) > 0 ? 1 : 0).join("")), 2);
epsilonRate = parseInt(Number(meanRate.map(el => parseInt(el) > 0 ? 0 : 1).join("")), 2);

console.log('Result: ' + (gammaRate * epsilonRate));