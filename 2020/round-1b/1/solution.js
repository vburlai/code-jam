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

let size = 102;
let field = Array.from({ length: 2 * size }, () => Array.from({ length: 2 * size }, () => null));
const rec = (x, y, pref) => {
    if (field[x][y] === null || field[x][y].length > pref.length) {
        field[x][y] = pref;
    }

    const step = 1 << pref.length;
    if (pref.length <= 30) {
        if (x + step < 2 * size) {
            rec(x + step, y, `${pref}E`)
        }

        if (y + step < 2 * size) {
            rec(x, y + step, `${pref}N`)
        }

        if (x - step >= 0) {
            rec(x - step, y, `${pref}W`)
        }

        if (y - step >= 0) {
            rec(x, y - step, `${pref}S`)
        }
    }
}
rec(size, size, '');
// console.error(field.map(el => el.join(', ')).join('\n'))

jam(function* (cs) {
    const [X, Y] = (yield).map(toInt);
    const res = field[X + size][Y + size];
    console.log(`Case #${cs}: ${res === null ? 'IMPOSSIBLE' : res}`);
});
