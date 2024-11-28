const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

const template = input[0].split('');
const pairs = input.slice(2).map(el => el.split(' -> '));

let pairDict = {}
let letterDict = {}

pairs.forEach(pair => {
    const [p, l] = pair;
    if (pairDict[p] === undefined) pairDict[p] = 0;
    if (letterDict[l] === undefined) letterDict[l] = 0;
});

template.forEach(letter => letterDict[letter]++);
for (let i = 0; i < template.length - 1; i++) {
    const pair = template[i] + template[i + 1];
    pairDict[pair]++;
}

for (let i = 0; i < 40; i++) {
    let toAdd = {}
    let toRemove = {}
    pairs.forEach(pair => {
        const [p, l] = pair;
        if (pairDict[p] > 0) {
            const value = pairDict[p];
            const p1 = p[0] + l;
            const p2 = l + p[1];
            if (toAdd[p1] === undefined) toAdd[p1] = value;
            else toAdd[p1] += value;
            if (toAdd[p2] === undefined) toAdd[p2] = value;
            else toAdd[p2] += value;
            letterDict[l] += value;

            if (toRemove[p] === undefined) toRemove[p] = value;
            else toRemove[p] += value;
        }
    });
    for (const [key, value] of Object.entries(toAdd)) {
        pairDict[key] += value;
    }
    for (const [key, value] of Object.entries(toRemove)) {
        pairDict[key] -= value;
    }
}

const min = Math.min(...Object.values(letterDict));
const max = Math.max(...Object.values(letterDict));

console.log(`Result: ${max - min}`);