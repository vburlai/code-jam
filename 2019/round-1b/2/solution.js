'use strict';

const Jam = (generator, countCases = true) => {
    let cases = 1, caseNumber = 1, iter = null;
    const reset = () => { iter = generator(caseNumber); iter.next(); }, { stdin, stdout } = process;
    const reader = require('readline').createInterface({ input: stdin, output: stdout, terminal: false});
    reader.on('line', line => {
        if (countCases) {
            cases = parseInt(line, 10); countCases = false;
        } else {
            const { value, done } = iter.next(line.split(' '));
            value                && console.log(value);
            done                 && reset(++caseNumber);
            (caseNumber > cases) && process.exit(0);
        }
    });
    reset();
};

Jam(function* () {
    const [ T ] = (yield).map(Number);

    for (let i = 1; i <= T; i++) {
        let res = Array.from({ length: 6 }, () => 0);

        const num1 = parseInt(yield 220, 10);
        const r6base = Math.pow(2, 36);
        const r5base = Math.pow(2, 44);
        const r4base = Math.pow(2, 55);
        res[5] = num1/r6base%128;
        res[4] = Math.floor(num1/r5base)%128;
        res[3] = Math.floor(num1/r4base)%128;
    
        const num2 = parseInt(yield 54, 10);
        const r4base2 = Math.pow(2, 13);
        const r3base = Math.pow(2, 18);
        const r2base = Math.pow(2, 27);
        const r1base = Math.pow(2, 54);
        res[2] = Math.floor((num2 - res[3] * r4base2)/r3base)%128;
        res[1] = Math.floor(num2/r2base)%128;
        res[0] = Math.floor(num2/r1base)%128;
    
        const [ verdict ] = yield res.join(' ');
        if (verdict === '-1') {
            process.exit(0);
        }
    }
}, false);
