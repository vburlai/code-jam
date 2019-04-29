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

Jam(function* (caseNumber) {
    const inputLine = yield outputLine;
});
