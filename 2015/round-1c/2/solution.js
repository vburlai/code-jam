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
    const [k, l, S] = (yield).map(toInt);
    const [K] = yield;
    const [L] = yield;
    let res;
    if (S <= 7) {
        const combos = genCombos(K, S);
        const payments = combos.map(c => getPayment(c, L));
        const max = payments.reduce((a, b) => a > b ? a : b);
        const sum = payments.reduce((a, b) => a + b);
        res = (max * payments.length - sum) / payments.length;
    }
    console.log(`Case #${cs}: ${res}`);
});

const genCombos = (K, S) => {
    let res = [''];
    const rec = (pos) => {
        if (pos > 0) {
            const res2 = K.split('').reduce((acc, k) => acc.concat(res.map(r => k + r)), []);
            res = res2;
            rec(pos - 1);
        }
    }
    rec(S);
    return res;
}

const getPayment = (s, l) => {
    let res = 0;
    const ll = l.length;
    for (let i = 0; i <= s.length - ll; i++) {
        if (s.substring(i, i + ll) === l) {
            res++;
        }
    }
    return res;
}