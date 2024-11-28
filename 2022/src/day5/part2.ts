console.clear();
import fs from 'fs';
const filename = 'input.txt';

// types
interface Movement {
  amount: number;
  origin: number;
  destiny: number;
}

// parsing 
const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });

const rawInstructions = rawInput.split('\n');
const rawCrates = rawInstructions.splice(0, rawInstructions.indexOf(''));

rawInstructions.splice(0, 1); // remove empty line from instructions

const reversedCrates = rawCrates.reverse();

const [indexes] = rawCrates.splice(0, 1);
const columns = Math.max(...indexes.split(' ').filter(Number).map(Number));

const crates: string[][] = Array(columns).fill(null).map(() => []);
reversedCrates.forEach((value) => {
  const row = value
    .match(/.{1,4}/g)
    .map((el) => el.replace(/[^\w\s!?]/g, ''))
    .map((el) => el.replace(/\ /g, ''));
  
  row.forEach((el, index) => {
    if (el !== '') {
      crates[index].push(el);
    }
  });
});

const instructions: Movement[] = rawInstructions.map((instruction) => {
  const [amount, origin, destiny] = instruction.split(' ').filter(Number).map(Number);
  return { amount, origin, destiny };
});

// problem
instructions.forEach((instruction) => {
  const { amount, origin, destiny} = instruction;
  const crateStack: string[] = [];
  for (let i = 0; i < amount; i++) {
    const crate = crates[origin - 1].pop();
    crateStack.unshift(crate);
  }
  crates[destiny - 1].push(...crateStack);
});

const result = crates.map((column) => column[column.length - 1]).join('');

console.assert(result === 'MCD', 'Result should be MCD but is ' + result);
