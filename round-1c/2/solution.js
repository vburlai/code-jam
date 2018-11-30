'use strict';

const reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let state = 'COUNTER';
let counter = 0;
let caseNumber = 1;
let N;
let counter2;
let sold;
let stats;

reader.on('line', line => {
    switch (state) {
        case 'COUNTER':
            counter = parseInt(line, 10);
            state = 'TASK1';
            break;

        case 'TASK1':
            N = parseInt(line, 10);
            state = 'TASK2';
            counter2 = 0;
            stats = (new Array(N)).fill(0);
            sold = {};
            break;

        case 'TASK2':
            const arr = line.split(' ').map(num => parseInt(num, 10));
            if (arr[0] === -1) {
                process.exit(0);
            } 
            console.log(solution(arr.slice(1)));
            if (++counter2 === N) {
                state = 'TASK1';
                if (++caseNumber > counter) {
                    process.exit(0);
                }
            }
            break;
    }
}).on('close', () => process.exit(0));

const solution = (input) => {
    let res = -1;
    input.forEach(el => stats[el]++);
    input.filter(el => !sold[el]).forEach(el => {
        if (res === -1) {
            res = el;
        };

        if(stats[el] < stats[res]) {
            res = el;
        };
    });

    if (res !== -1) {
        sold[res] = true;
    }

    return res;
};
