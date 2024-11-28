console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});
const input = rawInput.split('\n');

// types and consts
type Monkey = {
  name: string;
  number: number | string | null;
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

monkeys.find((monkey) => monkey.name === 'root').operation = '=';
monkeys.find((monkey) => monkey.name === 'humn').number = 'x';

// algorithm
while (monkeys.find((monkey) => monkey.name === 'root').number === null) {
  let changes = 0;
  monkeys.forEach((monkey) => {
    if (monkey.number === null) {
      const operand1 = monkeys.find((m) => m.name === monkey.operand1Name);
      const operand2 = monkeys.find((m) => m.name === monkey.operand2Name);
      
      if (operand1.number !== null && operand2.number !== null && typeof operand1.number === 'number' && typeof operand2.number === 'number') {
        switch (monkey.operation) {
          case '+':
            monkey.number = operand1.number + operand2.number;
            monkey.operand1Name = null;
            monkey.operand2Name = null;
            monkey.operation = null;
            changes++;
            break;
          case '-':
            monkey.number = operand1.number - operand2.number;
            monkey.operand1Name = null;
            monkey.operand2Name = null;
            monkey.operation = null;
            changes++;
            break;
          case '*':
            monkey.number = operand1.number * operand2.number;
            monkey.operand1Name = null;
            monkey.operand2Name = null;
            monkey.operation = null;
            changes++;
            break;
          case '/':
            monkey.number = operand1.number / operand2.number;
            monkey.operand1Name = null;
            monkey.operand2Name = null;
            monkey.operation = null;
            changes++;
            break;
        }
      }
    }
  });
  if (changes === 0) break;
}

// parse equation
const rootMonkey = monkeys.find((monkey) => monkey.name === 'root');
const equation = `${rootMonkey.operand1Name} ${rootMonkey.operation} ${rootMonkey.operand2Name}`;

const isNotNumber = (token: string) => /^[A-Za-z0-9]*$/.test(token);

// parse equation
let finalEquation = equation;
while (true) {
  const splitEquation = finalEquation.split(' ');
  
  let changes = 0;
  splitEquation.forEach((token) => {
    // word
    // if token is 4 letters long
    if (token.length === 4 && isNotNumber(token)) {
      const monkey = monkeys.find((monkey) => monkey.name === token);
      if (monkey.number !== null) {
        const index = splitEquation.indexOf(token);
        splitEquation[index] = monkey.number.toString();
      } else {
        const index = splitEquation.indexOf(token);
        splitEquation[index] = `( ${monkey.operand1Name} ${monkey.operation} ${monkey.operand2Name} )`;
      }
      changes++;
    }
  });
  finalEquation = splitEquation.join(' ');
  if (changes === 0) break;
}

console.log(finalEquation.split(' ').join(''));