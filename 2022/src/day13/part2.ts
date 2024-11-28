console.clear();
import fs from 'fs';
const filename = 'input.txt';

const DEBUG = false;
type Packet = Array<number | Packet>;

// parsing
const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const packets = rawInput.split('\n').filter(e => e !== '')


// helpers
let absoluteAnswer: boolean | null = null; // I feel bad for this 

const parseLine = (line: string): Packet => line.startsWith('[') ? eval(line) : [];
const toList = (input: number) => [input];
const compareLines = (left: number | Packet, right: number | Packet): boolean => {
  if (typeof left === 'number' && typeof right === 'number') {
    DEBUG && console.log('NUMBER COMPARISON: ', left, right);
    DEBUG && console.log('-----');
    if (left < right) {
      DEBUG && console.log(`\t${left} < ${right}, right order`);
      if (absoluteAnswer === null) absoluteAnswer = true;
      return true;
    }
    if (left > right) {
      DEBUG && console.log(`\t${left} > ${right}, wrong order`);
      if (absoluteAnswer === null) absoluteAnswer = false;
      return false;
    }
    return true;  // the list is still ordered (hopefully)
  } else if (typeof left === 'number' && Array.isArray(right)) {
    const newLeft = toList(left);
    return compareLines(newLeft, right);
  } else if (Array.isArray(left) && typeof right === 'number') {
    const newRight = toList(right);
    return compareLines(left, newRight);
  } else if (Array.isArray(left) && Array.isArray(right)) {
    let result = true;
    DEBUG && console.log('LIST COMPARISON: ', left, 'with', right);
    DEBUG && console.log('-----');
    for (let i = 0; i < left.length; i++) {
      const leftItem = left[i];
      const rightItem = right[i];

      if (rightItem === undefined || rightItem === null) {
        DEBUG && console.log('\tRight side ran out of items, WRONG ORDER');
        result = false;
        if (absoluteAnswer === null) absoluteAnswer = false;
        break;
      }
      result &&= compareLines(leftItem, rightItem);
    }
    if (right.length > left.length) {
      DEBUG && console.log('\tLeft side ran out of items, CORRECT ORDER');
      if (absoluteAnswer === null) absoluteAnswer = true;
      result = true;
    }
    if (absoluteAnswer !== null) return absoluteAnswer;
    return result;
  }
};

// algorithm
// const orderedPairs = input.map((pair, i) => {
//   DEBUG && console.log('\n\n-----------------------');
//   DEBUG && console.log(`-      ROUND ${i+1}      -`);
//   DEBUG && console.log('-----------------------');

//   absoluteAnswer = null;
//   const [leftRaw, rightRaw] = pair;
//   const left = parseLine(leftRaw);
//   const right = parseLine(rightRaw);
//   const result = compareLines(left, right);
//   const correct = absoluteAnswer !== null ? absoluteAnswer : true;
//   if (correct) return i + 1;
//   return -1;
// });

// add extra packets
packets.push('[[2]]');
packets.push('[[6]]');

const orderedPackets = packets.sort((a, b) => {
  absoluteAnswer = null;
  const left = parseLine(a);
  const right = parseLine(b);
  compareLines(left, right);
  const correct = absoluteAnswer !== null ? absoluteAnswer : true;
  return correct ? -1 : 1;
});


const result = (orderedPackets.indexOf('[[2]]') + 1) * (orderedPackets.indexOf('[[6]]') + 1);
console.assert(result === 140, 'The result should be 140 but was ' + result);