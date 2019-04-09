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
            state = 'TASK';
            break;

        case 'TASK':
            const args = line.split(' ');
            console.log(`Case #${ caseNumber++ }: ${ solution.apply(null, args) }`);
            state = (caseNumber > counter) ? 'DONE' : 'TASK';
            break;

    }
});

const solution = (N) => {
    const A = N.split('').map(c => c === '4' ? '3' : c).join('');
    const ind = N.indexOf('4');
    const B = N.split('').slice(ind).map(c => c === '4' ? '1' : '0').join('');
    
    return `${A} ${B}`;
};
