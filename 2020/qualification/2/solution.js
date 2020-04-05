'use strict';

const Jam = (generator, countCases = true) => {
    let cases = 1, cs = 1, iter = null;
    const reset = () => { iter = generator(cs); iter.next(); }, { stdin, stdout } = process;
    const reader = require('readline').createInterface({ input: stdin, output: stdout, terminal: false });
    reader.on('line', line => {
        if (countCases) {
            cases = parseInt(line, 10); countCases = false;
        } else {
            const { done } = iter.next(line.split(' '));
            done && (++cs > cases) && process.exit(0);
            done && reset();
        }
    });
    reset();
};

let RES, bal;

Jam(function* (cs) {
    RES = '';
    const [ S ] = yield;
    bal = 0;

    for(let i = 0; i < S.length; i++) {
        const nc = parseInt(S[i], 10);
        if (nc > bal) {
            RES += rep('(', nc - bal);
        }
        if (nc < bal) {
            RES += rep(')', bal - nc);
        }
        bal = nc;
        RES += S[i];
    }

    if (bal > 0) {
        RES += rep(')', bal);
    }
    console.log(`Case #${cs}: ${RES}`);
});

const rep = (c, n) => 
 Array.from({ length: n }, () => c).join('');