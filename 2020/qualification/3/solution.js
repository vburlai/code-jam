'use strict';

const Jam = (generator, countCases = true) => {
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

Jam(function* (cs) {
    const [ N ] = (yield).map(n => parseInt(n, 10))
    let list = [];
    for(let i = 0; i < N; i++) {
        const [S, E] = (yield).map(n => parseInt(n, 10))
        list[i] = { id: i, S, E};
    }
    list.sort((a, b) => a.S - b.S);
    
    let C = null;
    let J = null;
    let impossible = false;
    let res = Array.from({ length: N });
    for(let i = 0; i < N; i++) {
        const {id, S} = list[i]

        if (C === null || S >= list[C].E) {
            C = i;
            res[id] = 'C';
        } else {
            if (J === null || S >= list[J].E) {
                J = i;
                res[id] = 'J';
            } else {
                impossible = true;
            }
        }
    }

    let result = res.join('')
    if (impossible) {
        result = 'IMPOSSIBLE';
    }
    console.log(`Case #${cs}: ${result}`);
});
