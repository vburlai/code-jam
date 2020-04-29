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
    const [N, K] = (yield).map(toInt);
    const [strU] = yield;
    let Ux4 = toInt(strU.replace('.', ''));
    const Px4 = (yield).map(p => p.replace('.', '')).map(toInt);
    let res;
    if (N === K) {
        while (Ux4) {
            const minPos = Px4.reduce((m, v, ind) => v < Px4[m] ? ind : m, 0)
            Px4[minPos]++;
            Ux4--;
        }

        res = Px4.reduce((acc, P) => acc * P / 10000, 1.0);
    }

    console.log(`Case #${cs}: ${res}`);
});
