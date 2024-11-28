const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});
const input = rawinput.split('\n');

const mostCommonBit = (arr, index, criteria) => {
    let copyArr = arr.slice();
    let count = 0;
    copyArr.forEach(el => {
        if (el.charAt(index) === '0') {
            count--;
        } else if (el.charAt(index) === '1') {
            count++;
        } else {
            console.log('mostCommonBit error');
        }
    });
    if (criteria === 'o2') {
        if (count > 0) return '1';
        else if (count < 0) return '0';
        else return '1';
    } else if (criteria === 'co2') {
        if (count > 0) return '0';
        else if (count < 0) return '1';
        else return '0';
    } else {
        console.log('criteria error');
    }
}

let o2arr = input.slice();
let co2arr = input.slice();
let position = 0;

while (o2arr.length > 1) {
    const commonbit = mostCommonBit(o2arr, position, 'o2');
    o2arr = o2arr.filter(el => el.charAt(position) === commonbit);
    position++;
}

position = 0;
while (co2arr.length > 1) {
    const commonbit = mostCommonBit(co2arr, position, 'co2');
    co2arr = co2arr.filter(el => el.charAt(position) === commonbit);
    position++;
}

console.log('Result: ' + (parseInt(o2arr, 2) * parseInt(co2arr, 2)));