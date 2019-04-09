'use strict';

const reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let state = 'COUNTER';
let counter = 0;
let caseNumber = 1;

reader.on('line', line => {
    switch (state) {
        case 'COUNTER':
            counter = parseInt(line, 10);
            state = 'TASK1';
            break;
        
        case 'TASK1':
            // skip line
            state = 'TASK2';
            break;

        case 'TASK2':
            const args = line.split(' ').map(num => parseInt(num, 10));
            console.log(`Case #${ caseNumber++ }: ${ solution(args) }`);
            state = (caseNumber > counter) ? 'DONE' : 'TASK1';
            break;

    }
});

const solution = arr => {
    const troubled = troubleSort(arr);
    const mistakePos = checkSorted(troubled).mistakePos;
    return replaceNull(mistakePos, 'OK');
};

const troubleSort = L => {
    let done = false;
    while (! done) {
        done = true;
        for (let i = 0; i < L.length - 2; i++) {
            if (L[i] > L[i+2]) {
                done = false;
                L = reverseSublist(L, i);
            }
        }
    }
    return L;
}

const reverseSublist = (arr, ind) => {
    let L = arr.slice(0); // clone
    L[ind] = arr[ind + 2];
    L[ind + 2] = arr[ind];
    return L;
}

const replaceNull = (el, value) => el === null ? value : el;

const checkSorted = arr =>
    arr.reduce(
        (acc, el, ind) => 
            (replaceNull(acc.prev, el) <= el) ?
                { prev: el, mistakePos: acc.mistakePos } :
                { prev: el, mistakePos: replaceNull(acc.mistakePos, ind - 1) },
        { prev: null, mistakePos: null }
    );