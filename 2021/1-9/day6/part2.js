const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split(',').map(el => parseInt(el));
const log = false;

const MAX_VALUE = Math.max(...input);

const rotateDict = dict => {
    let newDict = {...dict};
    newDict['0'] = 0;
    for (let i = 1; i <= 8; i++) {
        newDict[i - 1] = dict[i];
    }
    newDict['8'] = 0;
    return newDict;
}

const getResult = it => {
    let dict = {};
    input.forEach(el => {
        dict[el] = dict[el] === undefined ? 1 : dict[el] + 1;
    });
    dict['0'] = 0;
    for (let i = MAX_VALUE + 1; i <= 8; i++) {
        dict[i] = 0;
    }

    for (let i = 0; i < it; i++) {
        let toAppend = dict['0'];
        dict = rotateDict(dict);
        dict['6'] += toAppend;
        dict['8'] = toAppend;
    }

    let total = 0;
    Object.values(dict).forEach(el => total += el);
    return total;
}

console.log(`Result: ${getResult(256)}`);