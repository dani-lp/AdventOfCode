const fs = require('fs');
const filename = 'testinput.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split(',').map(el => parseInt(el));
const log = false;

const getResult = it => {
    let arr = input.slice();
    for (let i = 0; i < it; i++) {
        let toAppend = 0;
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] === 0) {
                toAppend++;
                arr[j] = 6;
            } else {
                arr[j]--;
            }
        }
        for (let j = 0; j < toAppend; j++) {
            arr.push(8);
        }
    }
    return arr.length;
}

console.log(`Result: ${getResult(30)}`);