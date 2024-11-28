console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
const DEBUG = false;

const translation = {
  2: 2,
  1: 1,
  0: 0,
  '-': -1,
  '=': -2,
} as const;

const inverseTranslation = {
  0: 0,
  1: 1,
  2: 2,
  3: '1=',
  4: '1-',
} as const;

const lastTranslation = {
  '-2': '=',
  '-1': '-',
  0: 0,
  1: 1,
  2: 2,
} as const;

// functions
const translateSNAFU = (num: string): number => {
  const numArray = num.split('') as (keyof typeof translation)[];
  const translatedNumArray = numArray.map((char) => translation[char]);
  return translatedNumArray.map((num, index) => {
    return num * (5 ** (translatedNumArray.length - index - 1));
  }).reduce((a, b) => a + b, 0);
};

const toSNAFU = (num: number): string => {
  const result: string[] = [];
  while (num > 5) {
    const rest = num % 5;
    num = Math.floor(num / 5);
    result.push(inverseTranslation[rest]);
  }
  result.push(inverseTranslation[num]);

  // index, how much to carry
  const carryOverMap = new Map<number, number>();
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    if (char === '1=') {
      carryOverMap.set(i + 1, 1);
      result[i] = '-2';
    } else if (char === '1-') {
      carryOverMap.set(i + 1, 1);
      result[i] = '-1';
    }
  }

  const numberedResult = result.map((char) => parseInt(char));
  for (let i = 0; i < numberedResult.length; i++) {
    const carryOver = carryOverMap.get(i);
    if (carryOver !== undefined) {
      if (numberedResult[i] === 2) {
        numberedResult[i] = -2;
        carryOverMap.set(i + 1, 1);
      } else {
        numberedResult[i] += carryOver;
      }
    }
  }
  if (carryOverMap.get(numberedResult.length) !== undefined) {
    numberedResult.push(1);
  }
  numberedResult.reverse();
  return numberedResult.map(c => lastTranslation[c]).join('');
};

if (DEBUG) {
  console.assert(toSNAFU(1) === '1');
  console.assert(toSNAFU(6) === '11');
  console.assert(toSNAFU(15) === '1=0');
  console.assert(toSNAFU(12345) === '1-0---0');
  console.assert(toSNAFU(314159265) === '1121-1110-1=0');
}

const result = toSNAFU(input.map((line) => translateSNAFU(line)).reduce((a, b) => a + b, 0));
console.assert(result === '2=-1=0', `Expected '2=-1=0', got '${result}'`);