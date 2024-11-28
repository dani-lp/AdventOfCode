console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n').map((line) => parseInt(line));

type Element = { index: number, value: number };
const DECRYPTION_KEY = 811589153;

const elements: Element[] = input.map(n => n * DECRYPTION_KEY).map((value, index) => ({ index, value }));
const sortableElements = elements.map((element) => ({ index: element.index, value: element.value }));

const mix = (baseArr: Element[], sortableArr: Element[]): Element[] => {
  return baseArr.reduce((arr, element) => {
    if (element.value === 0) return arr;
    const elementToSort = arr.find((e) => e.index === element.index);
    const currentPosition = arr.findIndex((e) => e.index === elementToSort.index);
    
    const intendedPosition = currentPosition + elementToSort.value;
    let nextPosition = intendedPosition;
    if ((intendedPosition % (arr.length - 1)) === 0) {
      arr.splice(currentPosition, 1);
      nextPosition = arr.length - 1;
      arr.push(elementToSort);
    } else if ((intendedPosition % (arr.length - 1)) === arr.length - 1) {
      arr.splice(currentPosition, 1);
      nextPosition = 0;
    } else if (intendedPosition < 0) {
      const invertedPosition = (arr.length - 1 -currentPosition) + Math.abs(elementToSort.value);
      nextPosition = (arr.length - 1) - (invertedPosition % (arr.length - 1));
      arr.splice(currentPosition, 1);
      arr.splice(currentPosition > nextPosition ? nextPosition : nextPosition, 0, elementToSort);
    } else if (intendedPosition > arr.length - 1) {
      nextPosition = nextPosition % (arr.length - 1);
      arr.splice(currentPosition, 1);
      arr.splice(currentPosition > nextPosition ? nextPosition : nextPosition, 0, elementToSort);
    } else {
      arr.splice(currentPosition, 1);
      arr.splice(currentPosition > nextPosition ? nextPosition : nextPosition, 0, elementToSort);
    }

    return arr;
  }, sortableArr);
};

let currentMix = mix(elements, sortableElements);

for (let i = 1; i < 10; i++) {
  currentMix = mix(elements, currentMix);
  console.log('mix', i);
}

const finalArray = currentMix;
const indexOfZero = finalArray.findIndex((e) => e.value === 0);

const result =
  finalArray[(indexOfZero + 1000) % finalArray.length].value +
  finalArray[(indexOfZero + 2000) % finalArray.length].value +
  finalArray[(indexOfZero + 3000) % finalArray.length].value;
console.assert(result === 1623178306, 'Expected 1623178306, got ' + result);