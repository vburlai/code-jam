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
    const [Xs, Ys, M] = yield;
    let X = toInt(Xs);
    let Y = toInt(Ys);
    let res = 'IMPOSSIBLE';
    if (X === 0 && Y === 0) {
        res = 0;
    } else {
        for (let i = 0; i < M.length; i++) {
            const m = M[i];
            const t = i + 1;
            if (m === 'S') {
                Y--;
            }
            if (m === 'N') {
                Y++;
            }
            if (m === 'W') {
                X--;
            }
            if (m === 'E') {
                X++;
            }

            if (Math.abs(X) + Math.abs(Y) <= t && res === 'IMPOSSIBLE') {
                res = t;
            }
        }
    }
    console.log(`Case #${cs}: ${res}`);
});
