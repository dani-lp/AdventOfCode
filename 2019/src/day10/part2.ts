import fs from 'fs';
const filename = 'testinput.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});
const input = rawInput.split('\n');
