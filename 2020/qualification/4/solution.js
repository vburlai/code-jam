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

let bits;

jam(function* () {
    const [T, B] = (yield).map(toInt);
    for (let i = 0; i < T; i++) {
        if (B === 10) {
            let res = ''
            for (let j = 1; j <= B; j++) {
                console.log(j);
                const [bit] = yield;
                res += bit;
            }
            console.log(res);
            const [verdict] = yield;
            if (verdict === 'N') {
                process.exit(0);
            }
        }

        if (B === 20) {
            bits = Array.from({ length: B }, () => ' ');
            let samePair = [1], opositePair = [1];

            for (let j = 1; j <= 10; j++) {
                const ind1 = j;
                console.log(ind1);
                const [bit1] = yield;
                const ind2 = B - j + 1;
                console.log(ind2);
                const [bit2] = yield;

                if (bit1 === bit2) {
                    if (samePair.length === 1) {
                        samePair = [ind1, ind2];
                    }
                } else {
                    if (opositePair.length === 1) {
                        opositePair = [ind1, ind2];
                    }
                }
            }

            // fluctuation

            let indSame, bitSame, indOposite, bitOposite;

            const scans = [
                [samePair[0], opositePair[0], 1, 2, 3],
                [4, 5, 6, 7],
                [8, 9, 10]
            ]
            for (let scan of scans) {
                for (let ind of scan) {
                    console.log(ind);
                    const bit1 = (yield)[0];
                    bits[ind - 1] = bit1;
                    console.log(B - ind + 1);
                    const bit2 = (yield)[0];
                    bits[B - ind] = bit2;
                }

                // fluctuation between scans

                indSame = samePair[0];
                console.log(indSame);
                bitSame = (yield)[0];
                if (bitSame !== bits[indSame - 1]) {
                    invertBits()
                }

                indOposite = opositePair[0];
                console.log(indOposite);
                bitOposite = (yield)[0];
                if (bitOposite !== bits[indOposite - 1]) {
                    bits.reverse()
                }
            }

            console.log(bits.join(''));
            const [verdict] = yield;
            if (verdict === 'N') {
                process.exit(0);
            }
        }

        if (B === 100) {
            bits = Array.from({ length: B }, () => ' ');
            let samePair = null, opositePair = null;
            let count = 0;

            for (let i = 1; i <= 50; i++) {
                if (bits[i - 1] === ' ') {
                    console.log(i)
                    console.log(B - i + 1)
                    count += 2;
                    const [[bit1], [bit2]] = [yield, yield];
                    bits[i - 1] = bit1; bits[B - i] = bit2;

                    if (bit1 === bit2) {
                        samePair = i;
                    } else {
                        opositePair = i;
                    }

                    if (count % 10 === 0) {
                        if (samePair === null) {
                            console.log(1); yield;
                        } else {
                            console.log(samePair)
                            const [bitS] = yield;
                            if (bitS !== bits[samePair - 1]) {
                                invertBits();
                            }
                        }
                        if (opositePair === null) {
                            console.log(1); yield;
                        } else {
                            console.log(opositePair)
                            const [bitO] = yield;
                            if (bitO !== bits[opositePair - 1]) {
                                bits.reverse();
                            }
                        }
                        count += 2;
                    }
                }
            }
            console.log(bits.join(''));
            const [verdict] = yield;
            if (verdict === 'N') {
                process.exit(0);
            }
        }
    }
}, false);

const invertBits = () => {
    for (let i in bits) {
        if (bits[i] === '1') {
            bits[i] = '0';
        } else if (bits[i] === '0') {
            bits[i] = '1';
        }
    }
}