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

max_x++;
max_y++;


const fold = (paper, paperfold) => {
    folds.forEach(fold => {
        let [axis, index] = fold.split(' ')[2].split('=');
        index = parseInt(index);
        max_x = paper[0].length;
        max_y = paper.length;
        paperfold = [];

        if (axis === 'x') {
            if (index % 2 === 0) {
                for (let i = 0; i < max_y; i++) {
                    paperfold.push(Array(index - 1).fill('.'));
                }
            } else {
                for (let i = 0; i < max_y; i++) {
                    paperfold.push(Array(index).fill('.'));
                }
            }
        } else if (axis === 'y') {
            if (index % 2 === 0) {
                for (let i = 0; i < index; i++) {
                    paperfold.push(Array(max_x).fill('.'));
                }
            } else {
                for (let i = 0; i < index; i++) {
                    paperfold.push(Array(max_x).fill('.'));
                }
            }
        } else {
            console.log('Error');
        }
        
        if (axis === 'x') {
            for (let i = 0; i < max_y; i++) {
                for (let j = 0; j < index; j++) {
                    const value = paper[i][j];
        
                    if (value === '#') {
                        paperfold[i][j] = '#';
                    }
                }
                
                for (let j = index + 1; j < max_x; j++) {
                    const value = paper[i][j];
                    
                    if (value === '#') {
                        paperfold[i][index - (j - index)] = '#';
                    }
                }
            }
        } else if (axis === 'y') {
            for (let i = 0; i < index; i++) {
                for (let j = 0; j < max_x; j++) {
                    const value = paper[i][j];
                    if (value === '#') paperfold[i][j] = '#';
                }
            }
            
            for (let i = index + 1; i < max_y; i++) {
                for (let j = 0; j < max_x; j++) {
                    const value = paper[i][j];
                    
                    if (value === '#') {
                        paperfold[index - (i - index)][j] = '#';
                    }
                }
            }
        } else {
            console.log('ERROR');
        }

        paper = paperfold;
    });
    console.table(paperfold);
}

let pp = [];
let ppf = [];
for (let i = 0; i < max_y; i++) {
    pp.push(Array(max_x).fill('.'));
}

dots.forEach(el => {
    const [y, x] = el;
    pp[x][y] = '#';
});

fold(pp, ppf);