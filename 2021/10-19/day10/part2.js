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

let stack = [];
let points = [];
input.forEach((line, index, object) => {
    stack = [];
    for (let i = 0; i < line.length; i++) {
        const el = line[i];
        if (isOpening(el)) {
            stack.push(el);
        } else if (isClosing(el)) {
            const popped = stack.pop();
            if (popped !== closings[el]) {
                stack = [];
                break;
            }
        } else {
            console.log('ERROR');
        }
    }
    points[index] = 0;
    while (stack.length > 0) {
        const el = stack.pop();
        points[index] *= 5;
        
        if (el === '(') {
            points[index] += 1;
        } else if (el === '[') {
            points[index] += 2;
        } else if (el === '{') {
            points[index] += 3;
        } else if (el === '<') {
            points[index] += 4;
        } else {
            console.log('???');
        }
    }
});

points = points.filter(el => el != 0).sort((a,b) => a - b);

console.log(`Result: ${points[Math.floor(points.length/2)]}`);