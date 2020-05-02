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
    const [, D] = (yield).map(toInt);
    const A = (yield).map(toInt);
    let res = D - 1; // worst case
    if (D <= 3) {
        res = simple(D, A)
    } else {
        const sizes = A.reduce((acc, a) => acc.add(a), new Set())
        sizes.add(A[0] / D); // worst case
        for (let s of sizes) {
            // console.error(`size ${s}`);
            const multiples = A.map(a => a % s === 0);
            let sumM = A.reduce((acc, a, i) => multiples[i] ? acc + a : acc, 0);
            const used = A.filter((a, i) => multiples[i]);
            let unused = A.filter((a, i) => !multiples[i]).filter(a => a >= s);
            let cuts = A.reduce((acc, a, i) => multiples[i] ? (acc + a / s - 1) : acc, 0)
            // console.error(`cuts=${cuts}, used=${used}, unused=${unused}, sumM=${sumM}, D*s=${D * s}`);
            if (sumM === D * s) {
                // console.error(cuts)
                res = Math.min(res, cuts);
                break;
            }
            if (sumM > D * s) {
                used.sort((a, b) => a - b)
                while (sumM >= D * s) {
                    const last = used.pop();
                    // console.error(`pop = ${last}`);
                    sumM -= last;
                    if (sumM < D * s) {
                        // console.error(`new sumM=${sumM} , cuts = ${cuts}`)
                        res = Math.min(res, cuts);
                    }
                    cuts -= last / s - 1;
                    if (sumM === D * s) {
                        // console.error(`new sumM=${sumM} , cuts = ${cuts}`)
                        res = Math.min(res, cuts);
                    }
                }
            } else {
                unused.sort((a, b) => b - a);
                while (sumM < D * s && cuts < res && unused.length) {
                    for (let i = 0; i < unused.length && sumM < D * s && cuts < res; i++) {
                        // console.error(`unused[i] = ${unused[i]}`)
                        sumM += s;
                        unused[i] -= s;
                        cuts++;
                    }
                    // console.error(`sumM=${sumM}, unused=${unused}, cuts=${cuts}`)
                    unused = unused.filter(a => a >= s)
                    unused.sort((a, b) => b - a);
                }
                if (sumM === D * s) {
                    // console.error(`cuts = ${cuts}`)
                    res = Math.min(res, cuts);
                }
            }
            if (res === 0) {
                break;
            }
        }
    }
    console.log(`Case #${cs}: ${res}`);
});

const simple = (D, A) => {
    const counts = A.reduce((acc, a) => ({ ...acc, [a]: (acc[a] || 0) + 1 }), {});
    const max = Object.keys(counts).reduce((acc, k) => counts[k] > counts[acc] ? k : acc, Object.keys(counts)[0]);
    if (D === 2) {
        if (counts[max] >= 2) {
            return 0;
        }
        return 1;
    }

    if (D === 3) {
        if (counts[max] >= 3) {
            return 0;
        }

        if (counts[max] === 1) {
            for (let i of A) {
                for (let j of A) {
                    if (j === 2 * i) {
                        return 1;
                    }
                }
            }
        }

        if (counts[max] === 2) {
            if (A.length > 2) {
                return 1;
            }
        }

        return 2;
    }
}