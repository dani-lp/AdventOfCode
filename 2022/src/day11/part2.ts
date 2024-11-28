console.clear();
import fs from 'fs';
const filename = 'testinput.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });

// types and functions 
const ROUND_NUMBER = 10_000;

type Monkey = {
  id: number; // number of the monkey
  items: number[];
  operation: (item: number) => number;
  test: (item: number) => number;
}

const parseOperation = (operation: string): (item: number) => number => {
  const [value, operator] = operation.split(' ').reverse();
  if (operator === '+') {
    return (item: number) => item + Number(value === 'old' ? item : value);
  }
  return (item: number) => item * Number(value === 'old' ? item : value);
};

const parseTest = (testOperation: string, testTrue: string, testFalse: string): (item: number) => number => {
  const opSplit = testOperation.split(' ');
  const trueSplit = testTrue.split(' ');
  const falseSplit = testFalse.split(' ');
  const divisor = Number(opSplit[opSplit.length - 1]);
  allDivisors.push(divisor);
  const trueThrow = Number(trueSplit[trueSplit.length - 1]);
  const falseThrow = Number(falseSplit[falseSplit.length - 1]);

  return (item: number) => {
    if (item % divisor === 0) {
      return trueThrow;
    }
    return falseThrow;
  };
};

// parsing
const rawInputSplit = rawInput.split('\n');
const splitMonkeys = [...Array(Math.ceil(rawInputSplit.length / 7))].map(_ => rawInputSplit.splice(0, 7))

const monkeys: Monkey[] = [];
const allDivisors: number[] = [];
splitMonkeys.forEach((monkeyData) => {
  const [id, items, operation, testOperation, testTrue, testFalse] = monkeyData;

  const monkey: Monkey = {
    id: Number(id.split(' ')[1][0]),
    items: items.replace(/,/g, '').split(' ').filter(Number).map(Number),
    operation: parseOperation(operation),
    test: parseTest(testOperation, testTrue, testFalse),
  };
  monkeys.push(monkey);
});

// algorithm
const divisorsMult = allDivisors.reduce((a, b) => a * b, 1);
const inspections = new Map<number, number>();
for (let i = 0; i < ROUND_NUMBER; i++) {
  monkeys.forEach((monkey) => {
    while (monkey.items.length > 0) {
      const inspectedItem = monkey.items.shift();
      const worryLevelAfterInspection = monkey.operation(inspectedItem);
      const compressedWorryLevel = worryLevelAfterInspection % divisorsMult;
      const newItemOwner = monkey.test(compressedWorryLevel);
      monkeys[newItemOwner].items.push(compressedWorryLevel);
      inspections.set(monkey.id, !inspections.get(monkey.id) ? 1 : inspections.get(monkey.id) + 1);
    }
  });
}

// result
const sortedInspections = Array.from(inspections.values()).sort((a, b) => b - a);
const result = sortedInspections[0] * sortedInspections[1];

console.assert(result === 2713310158, `Expected 2713310158, got ${result} instead.`);