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

let row2 = [];

jam(function* (cs) {
    const [N] = (yield).map(toInt);

    let result = [];

    if (N <= 500) {
        result = [
            '1 1',
            ...Array.from({ length: N - 1 },
                (v, i) => `${i + 2} 1`
            ),
        ];
    }

    if (N === 501) {
        result = [
            '1 1', // 1
            '2 1', // 1
            '3 2', // 2
            '3 1', // 1
            ...Array.from({ length: N - 5 },
                (v, i) => `${i + 4} 1`
            )
        ]
    }

    if (N > 501) {
        let count = 1;
        let row = 1;
        result = ['1 1'];
        while (count < N) {
            if (N - count >= row) {
                result.push(`${row + 1} 2`)
                count += row;
            }
            if (count < N) {
                result.push(`${row + 1} 1`)
                count++;
                row++;
            }
        }
    }

    console.log(`Case #${cs}:`);
    console.log(result.join('\n'));
});
