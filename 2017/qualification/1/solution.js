'use strict';

const Jam = (generator, countCases = true) => {
    let cases = 1, cs = 1, iter = null;
    const reset = () => { iter = generator(cs); iter.next(); }, { stdin, stdout } = process;
    const reader = require('readline').createInterface({ input: stdin, output: stdout, terminal: false});
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

Jam(function* (cs) {
    const [ cakes, Kstr ] = yield;
    const K = parseInt(Kstr, 10);

    const rec = (state) => {
        const pos = state.indexOf('-');

        if (pos === -1) {
            return 0;
        }
        if (pos + K > state.length) {
            return Infinity;
        }
        return 1 + rec(flip(state, pos, K));
    }

    const result = rec(cakes);

    console.log(`Case #${cs}: ${isFinite(result) ? result : 'IMPOSSIBLE'}`);
});

const flip = (str, pos, len) => 
    str.substring(0, pos) +
    str.substring(pos, pos + len).replace(/\-/g, '_').replace(/\+/g, '-').replace(/_/g, '+') +
    str.substring(pos + len);
