const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

const lookup = { 
    '467889': 0,
    '89': 1,
    '47788': 2,
    '77889': 3,
    '6789': 4,
    '67789': 5,
    '467789': 6,
    '889': 7,
    '4677889': 8,
    '677889': 9
}

let counter = 0;
for (let line of input) {
    const entryInput = line.split(' | ')[0].split(' ');
    const entryOutput = line.split(' | ')[1].split(' ');

    const numMap = {}
    for (let entry of entryInput.join('')) {
        if (numMap[entry] === undefined) numMap[entry] = 1;
        else numMap[entry]++;
    }

    let count = '';
    for (let entry of entryOutput) {
        let element = [];
        for (let i = 0; i < entry.length; i++) {
            element.push(numMap[entry[i]]);
        }
        element.sort();
        count += parseInt(lookup[element.join('')]);
    }
    counter += parseInt(count);
}

console.log(`Result: ${counter}`);