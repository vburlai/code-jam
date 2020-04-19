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
const T9 = 1000000000;

jam(function* (cs) {
    const [T, A, B] = (yield).map(toInt);
    for (let i = 0; i < T; i++) {
        if (A === B) {
            if (A === T9 - 5) {
                let verdict = ''
                for (let x = -5; x <= 5 && verdict !== 'CENTER'; x++) {
                    for (let y = -5; y <= 5 && verdict !== 'CENTER'; y++) {
                        console.log(`${x} ${y}`)
                        verdict = (yield)[0];
                    }
                }
            }

            if (A === T9 - 50) {
                let xmax;
                let ymax;
                let verdict = '';
                for (let x = T9; x >= T9 - 100 && verdict !== 'HIT'; x -= 2) {
                    console.log(`${x} 0`)
                    verdict = (yield)[0];
                    xmax = x - T9 + 50;
                }
                verdict = '';
                for (let y = T9; y >= T9 - 100 && verdict !== 'HIT'; y -= 2) {
                    console.log(`0 ${y}`)
                    verdict = (yield)[0];
                    ymax = y - T9 + 50;
                }
                verdict = '';

                for (let x = -5; x <= 5 && verdict !== 'CENTER'; x++) {
                    for (let y = -5; y <= 5 && verdict !== 'CENTER'; y++) {
                        console.log(`${xmax + x} ${ymax + y}`)
                        verdict = (yield)[0];
                    }
                }
            }
        }
    }
}, false);
