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

let N, matrix, rows, cols;

Jam(function* (cs) {
    N = parseInt(yield, 10);
    matrix = Array.from({ length: N });
    rows = Array.from({ length: N }, () => ({}));
    cols = Array.from({ length: N }, () => ({}));
    for (let i = 0; i < N; i++) {
        matrix[i] = (yield).map(v => parseInt(v, 10))
    }
    const k = getTrace();
    scanMatrix();
    const r = getNumRows();
    const c = getNumCols();
    const result = `${k} ${r} ${c}`;
    console.log(`Case #${cs}: ${result}`);
});

const getTrace = () => {
    let res = 0;
    for (let i = 0; i < N; i++) {
        res += matrix[i][i];
    }
    return res;
}

const scanMatrix = () => {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            rows[i][matrix[i][j]] = 1;
            cols[j][matrix[i][j]] = 1;
        }
    }
}

const getNumRows = () => rows.filter(r => Object.keys(r).length < N).length

const getNumCols = () => cols.filter(r => Object.keys(r).length < N).length
