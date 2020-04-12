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

jam(function* (cs) {
    const [R, C] = (yield).map(toInt);
    const matrix = Array.from({ length: R }, () => [])
    const active = Array.from({ length: R }, () => Array.from({ length: C }, () => true))
    let result = 0;
    for (let i = 0; i < R; i++) {
        matrix[i] = (yield).map(toInt);
    }

    let play = true;
    while (play) {
        result += sumActive(matrix, active);

        const loosers = [];
        for (let i = 0; i < R; i++) {
            for (let j = 0; j < C; j++) {
                if (active[i][j]) {
                    const ns = [
                        getNeighbour(matrix, active, i, j, 0, 1),
                        getNeighbour(matrix, active, i, j, 0, -1),
                        getNeighbour(matrix, active, i, j, 1, 0),
                        getNeighbour(matrix, active, i, j, -1, 0),
                    ].filter(el => el !== null);
                    if (ns.length) {
                        const sum = ns.reduce((acc, el) => acc + el, 0);
                        const avg = sum / ns.length;
                        if (avg > matrix[i][j]) {
                            loosers.push([i, j]);
                        }
                    }
                }
            }
        }

        for (let l of loosers) {
            active[l[0]][l[1]] = false;
        }

        play = loosers.length > 0;
    }
    console.log(`Case #${cs}: ${result}`);
});

const sumActive = (matrix, active) => {
    return matrix.reduce(
        (acc, row, rowidx) =>
            acc + row.reduce((acc2, el, colidx) =>
                acc2 + (active[rowidx][colidx] ? el : 0), 0),
        0
    );
}

const getNeighbour = (matrix, active, r, c, dr, dc) => {
    r += dr;
    c += dc;
    while (r >= 0 && r < matrix.length && c >= 0 && c < matrix[0].length) {
        if (active[r][c]) {
            return matrix[r][c]
        }
        r += dr;
        c += dc;
    }

    return null;
}