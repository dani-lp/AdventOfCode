import fs from 'fs';
const filename = 'input.txt';

const scores = { 'A': 1, 'B': 2, 'C': 3, };

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

const getScore = (mMove: string, eMove: string) => {
  if (mMove === eMove) return 3 + scores[mMove];
  else if (mMove === 'A' && eMove === 'C') return 6 + scores[mMove];
  else if (mMove === 'C' && eMove === 'A') return 0 + scores[mMove];
  else return mMove > eMove ? 6 + scores[mMove] : 0 + scores[mMove];
};

const score = input.map((value) => {
  const [eMove, endResult] = value.split(' ');
  let mMove = 'A';
  if (endResult === 'Y') mMove = eMove;
  else if (endResult === 'Z') mMove = eMove === 'A'
    ? 'B'
    : eMove === 'B'
      ? 'C' : 'A';
  else mMove = eMove === 'A'
    ? 'C'
    : eMove === 'B'
      ? 'A' : 'B';
  return getScore(mMove, eMove);
}).reduce((a, b) => a + b, 0);

console.assert(score === 12, 'Score should be 12 but was ' + score);