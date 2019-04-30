'use strict';

const Jam = (generator, countCases = true) => {
    let cases = 1, cs = 1, iter = null;
    const reset = () => { iter = generator(cs); iter.next(); }, { stdin, stdout } = process;
    const reader = require('readline').createInterface({ input: stdin, output: stdout, terminal: false});
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

Jam(function* (cs) {
    const [ num ] = yield;

    const reducer = '9012345678';

    const rec = (pos, carry, str) => {
        if (pos < 0) {
            return str;
        }

        if (!str.length || str[0] >= num[pos]) {
            if (carry && num[pos] > '0') {
                return rec(pos - 1, false, `${reducer[num[pos]]}${str}`);
            }
            return rec(pos - 1, carry, `${num[pos]}${str}`);
        }

        return rec(pos - 1, carry, `${reducer[num[pos]]}${of9(str.length)}`)
    }
    const result = rec(num.length - 1, false, '');
    console.log(`Case #${cs}: ${result[0] === '0' ? result.slice(1) : result}`);
});

const of9 = length => Array.from({ length }, () => '9').join('');
