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

const solution = (D, prog) => {
    if (!isPossible(D, prog)) {
        return 'IMPOSSIBLE';
    }
    let result = 0;
    while( getDamage(prog) > D) {
        prog = replaceLast(prog, 'CS', 'SC');
        result++;
    }
    
    return result;
};

const replaceLast = (prog, search, replacement) => {
    const pos = prog.lastIndexOf(search);
    if (pos === -1) {
        throw new Error();
    }
    return `${ prog.substring(0, pos) }${ replacement }${ prog.substring(pos + search.length) }`;
}

const isPossible = (D, prog) => 
    getDamage(prog.replace(/C/g, '')) <= D

const getDamage = prog => 
    prog.split('').reduce(
        (acc, el) => 
            el === 'S' ? 
                { current: acc.current, total: acc.total + acc.current } :
                { current: acc.current * 2, total: acc.total },
        { current: 1, total: 0}
    ).total;
