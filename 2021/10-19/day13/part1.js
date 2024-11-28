const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

let brk = input.findIndex(el => el === '');
const dots = input.slice(0, brk).map(el => el.split(',').map(el => parseInt(el)));
const folds = input.slice(brk + 1);

let max_x = 0;
let max_y = 0;

dots.forEach(el => {
    const [x, y] = el;
    if (x > max_x) max_x = x;
    if (y > max_y) max_y = y;
});

const fold = (paper, paperfold) => {
    folds.forEach(fold => {
        let [axis, index] = fold.split(' ')[2].split('=');
        index = parseInt(index);
        max_y = paper.length - 1;
        max_x = paper[0].length - 1;
        paperfold = [];
        
        if (axis === 'x') {
            for (let i = 0; i <= max_y; i++) {
                paperfold.push(Array(index).fill('.'));
            }
        } else {
            for (let i = 0; i < parseInt(index); i++) {
                paperfold.push(Array(max_x + 1).fill('.'));
            }
        }
        
        if (axis === 'x') {
            for (let i = 0; i < paper.length; i++) {
                for (let j = 0; j < index; j++) {
                    const value = paper[i][j];
        
                    if (value === '#') {
                        paperfold[i][j] = '#';
                    }
                }
                
                for (let j = index; j < paper[i].length; j++) {
                    const value = paper[i][j];
                    
                    if (value === '#') {
                        paperfold[i][paper[i].length - j - 1] = '#';
                    }
                }
            }
        } else if (axis === 'y') {
            for (let i = 0; i < index; i++) {
                for (let j = 0; j < paper[i].length; j++) {
                    const value = paper[i][j];
                    if (value === '#') paperfold[i][j] = '#';
                }
            }
            
            for (let i = index; i < paper.length; i++) {
                for (let j = 0; j < paper[i].length; j++) {
                    const value = paper[i][j];
                    
                    if (value === '#') {
                        paperfold[paper.length - i - 1][j] = '#';
                    }
                }
            }
        } else {
            console.log('ERROR');
        }

        paper = paperfold;
    });
    let total = 0;
    paperfold.forEach(line => {
        line.forEach(el => {
            if (el === '#') total++;
        });
    });
    return total;
}

let pp = [];
let ppf = [];
for (let i = 0; i <= max_y; i++) {
    pp.push(Array(max_x + 1).fill('.'));
}

dots.forEach(el => {
    const [y, x] = el;
    pp[x][y] = '#';
});

const total = fold(pp, ppf);

// console.table(paperfold);

console.log(`Result: ${total}`);