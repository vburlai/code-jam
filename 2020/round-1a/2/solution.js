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

    if (N > 501 && N <= 1000) {
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

    if (N > 1000) {
        const max = 30;
        let remaining = N - max; // use all 30 rows of 1's on the edge
        let remainingReverseBits = getBits(remaining, max);

        console.error(remainingReverseBits);

        let left = true;
        for (let i = 1; i <= max; i++) {
            if (!remainingReverseBits[i]) {
                result.push(`${i} ${left ? 1 : i}`);
            } else {
                for (let j = 0; j < i; j++) {
                    result.push(`${i} ${left ? (j + 1) : (i - j)}`);
                }
                left = !left;
            }
        }
    }

    console.log(`Case #${cs}:`);
    console.log(result.join('\n'));
});

const getBits = (n, max) => {
    let res = {};
    for (let i = max; i >= 1; i--) {
        const pow = 1 << (i - 1);
        const sum = pow - 1;
        if (n > 0 && n >= sum) {
            res[i] = 1;
            n -= sum;
        }
    }
    return res;
}