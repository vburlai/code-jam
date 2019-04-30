'use strict';

const Jam = (generator, countCases = true) => {
    let cases = 1, caseNumber = 1, iter = null;
    const reset = () => { iter = generator(caseNumber); iter.next(); }, { stdin, stdout } = process;
    const reader = require('readline').createInterface({ input: stdin, output: stdout, terminal: false});
    reader.on('line', line => {
        if (countCases) {
            cases = parseInt(line, 10); countCases = false;
        } else {
            const { value, done } = iter.next(line.split(' '));
            value                && console.log(value);
            done                 && reset(++caseNumber);
            (caseNumber > cases) && process.exit(0);
        }
    });
    reset();
};

Jam(function* (caseNumber) {
    yield;
    const W = (yield).map(Number);
    const MAX_LEN = 140;

    let maxlen = 0;
    const dp = Array.from({ length: W.length + 1 }, 
        () => Array.from({ length: MAX_LEN }, () => Infinity)
    );
    dp[0][0] = 0;
    for(let i = 0; i < W.length; i++) {
        for (let j = 0; j < MAX_LEN; j++) {
            const heap = dp[i][j];

            if (isFinite(heap)) {
                dp[i+1][j] = Math.min(dp[i+1][j], heap);
                if (W[i] * 6 >= heap) {
                    dp[i+1][j+1] = Math.min(dp[i+1][j+1], heap + W[i]);
                    maxlen = Math.max(maxlen, j + 1);
                }
            } else {
                break;
            }
        }
    }

    return `Case #${caseNumber}: ${maxlen}`;
});
