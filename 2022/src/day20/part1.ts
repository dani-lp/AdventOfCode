console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n').map((line) => parseInt(line));

type Element = { index: number, value: number };
const DEBUG = false;

const normalizeValue = (value: number, length: number) => {
  if (value >= length) {
    return value - length - 1;
  } else if (Math.abs(value) >= length) {
    return value + length + 1;
  }
  return value;
};

const elements: Element[] = input.map((value, index) => ({ index, value }));
const sortableElements = elements.map((element) => ({ index: element.index, value: element.value }));
DEBUG && console.log(elements.map((e) => e.value).join(', '));

const finalArray = elements.reduce((arr, element) => {
  // 1.- locate the element in the sortable array
  const elementToSort = arr.find((e) => e.index === element.index);

  // 2.- compute its next position (check array bounds)
  const numberOfSwaps = element.value;
  let swapsLeft = numberOfSwaps;
  let currentIndex = arr.findIndex((e) => e.index === elementToSort.index);

  if (currentIndex === 0) {
    if (numberOfSwaps < 0) {
      const element = arr.shift();
      arr.push(element);
      currentIndex = arr.indexOf(element);
      swapsLeft++;
    }
  }

  if (numberOfSwaps > 0) {
    while (swapsLeft > 0) {
      [arr[currentIndex], arr[currentIndex + 1]] = [arr[currentIndex + 1], arr[currentIndex]];
      currentIndex++;
      if (currentIndex === arr.length - 1) {
        const element = arr.pop();
        arr.unshift(element);
        currentIndex = arr.indexOf(element);
      }
      swapsLeft--;
    }
  } else if (numberOfSwaps < 0) {
    while (swapsLeft < 0) {
      [arr[currentIndex], arr[currentIndex - 1]] = [arr[currentIndex - 1], arr[currentIndex]];
      currentIndex--;
      if (currentIndex === 0) {
        const element = arr.shift();
        arr.push(element);

        currentIndex = arr.indexOf(element);
      }
      swapsLeft++;
    }
  }
  DEBUG && console.log(arr.map((e) => e.value).join(', '));


  return arr;
}, sortableElements);

const indexOfZero = finalArray.findIndex((e) => e.value === 0);

const result =
  finalArray[(indexOfZero + 1000) % finalArray.length].value +
  finalArray[(indexOfZero + 2000) % finalArray.length].value +
  finalArray[(indexOfZero + 3000) % finalArray.length].value;
console.assert(result === 3, 'Expected 3, got ' + result);