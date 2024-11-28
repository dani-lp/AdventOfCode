const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

const template = input[0].split('');
const pairs = input.slice(2).map(el => el.split(' -> '));

for (let i = 0; i < 10; i++) {
    let toInsert = [];
    let counter = 1;
    for (let j = 0; j < template.length - 1; j++) {
        pairs.forEach(pair => {
            if (template[j] === pair[0].charAt(0) && template[j + 1] === pair[0].charAt(1)) {
                toInsert.push([pair[1], j + counter]);
                counter++;
            }
        });
    }
    toInsert.forEach(line => {
        template.splice(line[1], 0, line[0]);
    });
}

let dict = {}
template.forEach(l => {
    if (dict[l] === undefined) dict[l] = 1;
    else dict[l]++;
});

let minValue = 100000000000;
let maxValue = 0;
Object.values(dict).forEach(value => {
    if (value > maxValue) maxValue = value;
    else if (value < minValue) minValue = value;
});

console.log(`Result: ${maxValue - minValue}`);