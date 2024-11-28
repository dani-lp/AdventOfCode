import fs from 'fs';
const filename = 'input.txt';

const scores = { 'A': 1, 'B': 2, 'C': 3, };
const translations = { 'X': 'A', 'Y': 'B', 'Z': 'C' };

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.replace(/X|Y|Z/gi, (matched) => translations[matched]).split('\n');

const score = input.map((value) => {
  const [eMove, mMove] = value.split(' ');
  if (mMove === eMove) return 3 + scores[mMove];
  else if (mMove === 'A' && eMove === 'C') return 6 + scores[mMove];
  else if (mMove === 'C' && eMove === 'A') return 0 + scores[mMove];
  else return mMove > eMove ? 6 + scores[mMove] : 0 + scores[mMove];
}).reduce((a, b) => a + b, 0);

console.assert(score === 15, 'Score should be 15 but was ' + score);