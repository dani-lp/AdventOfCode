const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

const closings = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
}

const isOpening = c => c === '(' || c === '[' || c === '{' || c === '<';
const isClosing = c => c === ')' || c === ']' || c === '}' || c === '>';


const corruptions = {
    ')': 0,
    ']': 0,
    '}': 0,
    '>': 0
}
let stack = [];
for (let line of input) {
    for (let i = 0; i < line.length; i++) {
        const el = line[i];
        if (isOpening(el)) {
            stack.push(el);
        } else if (isClosing(el)) {
            const popped = stack.pop();
            if (popped !== closings[el]) {
                corruptions[el]++;
                break;
            }
        } else {
            console.log('ERROR');
        }
    }
}

const total = corruptions[')']*3 + corruptions[']']*57 + corruptions['}']*1197 + corruptions['>']*25137;
console.log(`Result: ${total}`);