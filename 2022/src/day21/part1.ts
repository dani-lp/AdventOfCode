console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});
const input = rawInput.split('\n');

// types and consts
type Monkey = {
  name: string;
  number: number | null;
  operation: string | null;
  operand1Name: string | null;
  operand2Name: string | null;
}

// parsing
const monkeys: Monkey[] = input.map((line) => {
  const splitData = line.split(' ');
  
  const name = splitData[0].slice(0, -1);
  if (splitData.length > 2) {
    const operand1Name = splitData[1];
    const operation = splitData[2];
    const operand2Name = splitData[3];
    return { name, number: null, operation, operand1Name, operand2Name };
  } else {
    const number = Number(splitData[1]);
    return { name, number, operation: null, operand1Name: null, operand2Name: null };
  }
});

// algorithm
while (monkeys.find((monkey) => monkey.name === 'root').number === null) {
  monkeys.forEach((monkey) => {
    if (monkey.number === null) {
      const operand1 = monkeys.find((m) => m.name === monkey.operand1Name);
      const operand2 = monkeys.find((m) => m.name === monkey.operand2Name);
      
      if (operand1.number !== null && operand2.number !== null) {
        switch (monkey.operation) {
          case '+':
            monkey.number = operand1.number + operand2.number;
            break;
          case '-':
            monkey.number = operand1.number - operand2.number;
            break;
          case '*':
            monkey.number = operand1.number * operand2.number;
            break;
          case '/':
            monkey.number = operand1.number / operand2.number;
            break;
          default:
            throw new Error(`Unknown operation ${monkey.operation}`);
        }
      }
    }
  });
}

// result
const result = monkeys.find((monkey) => monkey.name === 'root').number;
console.assert(result === 152, `Expected 152, got ${result}`);