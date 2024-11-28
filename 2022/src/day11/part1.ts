console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});

// types and functions 
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
const inspections = new Map<number, number>();
for (let i = 0; i < 20; i++) {
  monkeys.forEach((monkey) => {
    while (monkey.items.length > 0) {
      const inspectedItem = monkey.items.shift();
      const worryLevelAfterInspection = monkey.operation(inspectedItem);
      const worryLevelAfterBoredom = Math.floor(worryLevelAfterInspection / 3);
      const newItemOwner = monkey.test(worryLevelAfterBoredom);
      monkeys[newItemOwner].items.push(worryLevelAfterBoredom);
      inspections.set(monkey.id, !inspections.get(monkey.id) ? 1 : inspections.get(monkey.id) + 1);
    }
  });
}

// result
const sortedInspections = Array.from(inspections.values()).sort((a, b) => b - a);
const result = sortedInspections[0] * sortedInspections[1];

console.assert(result === 10605, `Expected 10605, got ${result} instead.`);