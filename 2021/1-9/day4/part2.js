const fs = require('fs');
const filename = 'input.txt';

const rawinput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawinput.split('\n');

const numberInput = input[0].split(',').map(el => parseInt(el));
const boardInput = input.slice(1);

// Move boards into their own array
let boardArr = [];
boardInput.forEach((el, index) => {
    if (el === '') {
        let board = [];
        for (let i = index + 1; i < index + 6; i++) {
            board.push(boardInput[i]);
        }
        boardArr.push(
            board
                .map(el => el.split(' ')
                    .filter(el => el !== '')
                    .map(el => parseInt(el)))
        );
    }
});

const markNums = num => {
    for (let i = 0; i < boardArr.length; i++) {
        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 5; k++) {
                if (boardArr[i][j][k] === num) {
                    boardArr[i][j][k] = -1;
                }
            }
        }
    }
}

const isBoardValid = board => {
    for (let i = 0; i < 5; i++) {
        if (board[i].every(el => el === board[i][0])) {
            return true;
        }
    }
    for (let i = 0; i < 5; i++) {
        let col = [];
        for (let j = 0; j < 5; j++) {
            col.push(board[j][i]);
        }
        if (col.every(el => el === col[0])) {
            return true;
        }
    }
    return false;
}

const getResult = () => {
    for (let num = 0; num < numberInput.length; num++) {
        markNums(numberInput[num]);
        if (boardArr.length > 1) {
            boardArr.forEach((item, index, object) => {
                if (isBoardValid(item)) {
                    object.splice(index, 1);
                }
            });
        } else {
            markNums(numberInput[num]);
            console.log(boardArr);
            if (isBoardValid(boardArr[0])) {
                let unmarkedSum = 0;
                for (let j = 0; j < 5; j++) {
                    for (let k = 0; k < 5; k++) {
                        if (boardArr[0][j][k] !== -1) {
                            unmarkedSum += boardArr[0][j][k];
                        }
                    }
                }
                console.log(unmarkedSum);
                console.log(numberInput[num]);
                return unmarkedSum * numberInput[num];
            }
        }
    }
}

console.log(getResult());