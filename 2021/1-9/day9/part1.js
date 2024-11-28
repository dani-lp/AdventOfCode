const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

const map = [];
input.forEach(line => {
    map.push(line.split(''));
});

let risklevels = [];
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        const value = parseInt(map[i][j]);
        
        let currentLevels = [];
        try {
            currentLevels.push(parseInt(map[i+1][j]));
        } catch {}
        try {
            currentLevels.push(parseInt(map[i-1][j]));
        } catch {}
        try {
            currentLevels.push(parseInt(map[i][j+1]));
        } catch {}
        try {
            currentLevels.push(parseInt(map[i][j-1]));
        } catch {}

        currentLevels = currentLevels.filter(el => !Number.isNaN(el));

        if (currentLevels.every(el => el > value)) {
            risklevels.push(value + 1);
        }
    }
}

let sum = 0;
risklevels.forEach(el => sum += el);

console.log(`Result: ${sum}`);