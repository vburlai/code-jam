'use strict';

const reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let state = 'COUNTER';
let counter = 0;
let caseNumber = 1;
const baseX = 10;
const baseY = 10;
let field = [];
let fieldW = 0;
let fieldH = 0;
let A = 0;

reader.on('line', line => {
    switch (state) {
        case 'COUNTER':
            counter = parseInt(line, 10);
            state = 'TASK1';
            break;

        case 'TASK1':
            A = parseInt(line, 10);
            if (A === 10) {
                resetField(4, 3);
            } else if (A === 20) {
                resetField(5, 4);
            } else if (A === 200) {
                resetField(20, 10);
            } else {
                throw new Error('invalid A');
            }
            state = 'TASK2';
            console.log(solution(A));
            break;
        
        case 'TASK2':
            const arr = line.split(' ').map(num => parseInt(num, 10));
            if (arr[0] === -1 && arr[1] === -1) {
                process.exit(0);
            } else if (arr[0] === 0 && arr[1] === 0) {
                state = 'TASK1';
                if (++caseNumber > counter) {
                    process.exit(0);
                }
            } else {
                setField(arr[0] - baseX, arr[1] - baseY);
                console.log(solution(A));
            }
            break;
    }
}).on('close', () => process.exit(0));

const resetField = (width, height) => {
    fieldW = width;
    fieldH = height;
    field = Array(width * height).fill(false);
}

const getField = (x, y) => field[x * fieldH + y];
const setField = (x, y) => field[x * fieldH + y] = true;

const solution = (A) => {
    for (let x = 1; x < fieldW - 1; x++) {
        for (let y = 1; y < fieldH - 1; y++) {
            if (hasEmpty(x, y)) {
                return `${ x + baseX } ${ y + baseY }`;
            }
        }
    }
    return `${ baseX + 1 } ${ baseY + 1 }`;
};

const hasEmpty = (x, y) =>
    !getField(x - 1, y - 1) ||
    !getField(x - 1, y) ||
    !getField(x - 1, y + 1) ||
    !getField(x, y - 1) ||
    !getField(x, y) ||
    !getField(x, y + 1) ||
    !getField(x + 1, y - 1) ||
    !getField(x + 1, y) ||
    !getField(x + 1, y + 1);
