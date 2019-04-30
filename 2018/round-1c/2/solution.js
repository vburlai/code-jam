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

Jam(function* () {
    const [ N ] = (yield).map(Number);
    let stats = Array.from({ length: N }, () => 0);
    let sold = new Set();

    for(let i = 0; i < N; i++) {
        const [D, ...likes] = (yield).map(Number);
        if (D === -1) {
            process.exit(0);
        }
        likes.forEach(el => stats[el]++);
        const options = likes.filter(el => !sold.has(el));
        const result = options.length ? options.reduce((acc, el) =>
            stats[el] < stats[acc] ? el : acc
        ) : -1;
        sold.add(result);
        console.log(result);
    }
});
