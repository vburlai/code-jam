'use strict';

const toInt = i => parseInt(i, 10);
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

let matrices, rows;
jam(function* (cs) {
    const [N, K] = (yield).map(toInt);

    rows = genRows(N)
    console.log(rows.length)
    matrices = genMatrices(N, rows)

    for (let matrix of matrices) {
        printMatrix(matrix, rows)
        console.log('')
        if (getTrace(matrix, rows) === K) {
            if (hasValidCols(matrix, rows, N)) {
                console.log(`Case #${cs}: POSSIBLE`);
                printMatrix(matrix, rows);
                return;
            }
        }
    }

    console.log(`Case #${cs}: IMPOSSIBLE`);
});

const genRows = (N) => {
    let rows = []
    const used = new Set();

    const rec = (pos, arr) => {
        if (pos === N) {
            rows = [...rows, arr];
        };

        for (let i = 1; i <= N; i++) {
            if (!used.has(i)) {
                used.add(i)
                rec(pos + 1, [...arr, i])
                used.delete(i)
            }
        }
    }

    rec(0, []);
    return rows;
}

const genMatrices = (N, rows) => {
    let res = []
    const used = new Set();

    const rec = (pos, arr) => {
        if (pos === N) {
            res = [...res, arr];
        };

        for (let i = 0; i < rows.length; i++) {
            if (!used.has(i)) {
                used.add(i)
                rec(pos + 1, [...arr, i])
                used.delete(i)
            }
        }
    }

    rec(0, []);
    return res;
}

const getTrace = (matrix, rows) => {
    let trace = 0;
    for (let i in matrix) {
        trace += rows[matrix[i]][i]
    }
    return trace;
}

const hasValidCols = (matrix, rows, N) => {
    const cols = Array.from({ length: N }, () => ({}));
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const val = rows[matrix[i]][j];
            cols[j][val] = true;
        }
    }

    return cols.filter(c => Object.keys(c).length !== N).length === 0
}

const printMatrix = (matrix, rows) => {
    for (let r of matrix) {
        console.log(rows[r].join(' '));
    }
}