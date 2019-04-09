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
            state = 'TASK';
            break;

        case 'TASK':
            const args = line.split(' ');
            console.log(`Case #${ caseNumber++ }: ${ solution.apply(null, args) }`);
            state = (caseNumber > counter) ? 'DONE' : 'TASK1';
            break;

    }
});

const solution = (steps) => {
    const mirror = steps.split('').map(s => s === 'E' ? 'S' : 'E').join('');
    
    return mirror;
};
