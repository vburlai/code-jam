'use strict';

const toInt = i => parseInt(i, 10);
const arrFr = (length, gen) => Array.from({ length }, gen);
const { Console } = require('console');
const console = new Console({ stdout: process.stdout, stderr: process.stderr });
const jam = (generator, countCases = true) => {
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

jam(function* (cs) {
    const [U] = (yield).map(toInt);
    const firstChars = new Set();
    const allChars = new Set();
    const rr = {};
    for (let i = 0; i < 10000; i++) {
        const [Ms, R] = yield;
        const M = toInt(Ms);
        rr[M] = rr[M] || new Set();
        rr[M].add(R);
        firstChars.add(R[0]);
        allChars.add(R[1]);
    }

    const res = arrFr(10, () => '?');
    for (let i of allChars) {
        if (!firstChars.has(i)) {
            res[0] = i;
        }
    }

    let known = new Set();
    known.add(res[0]);
    for (let i = 1; i < 10; i++) {
        for (let c of rr[i]) {
            if (!known.has(c)) {
                res[i] = c;
                known.add(c);
                break;
            }
        }
    }

    console.log(`Case #${cs}: ${res.join('')}`);
});
