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
    const [ N, K ] = (yield).map(Number);

    let list = new Cell(N);
    let count = new Map();
    count.set(N, 1);

    let min, max;
    for (let i = 0; i < K;) {
        const { val } = list;
        [ min, max ] = split(val);
        i+= count.get(val);

        list = list.next;
        if (list) {
            list = place(new Cell(min), list);
            list = place(new Cell(max), list);
        } else {
            list = place(new Cell(min), new Cell(max));
        }
        count.set(min, (count.get(min) || 0) + count.get(val));
        count.set(max, (count.get(max) || 0) + count.get(val));
    }
    console.log(`Case #${cs}: ${max} ${min}`);
});

const split = num => {
    const half = (num - 1) / 2;
    return [ Math.floor(half), Math.ceil(half) ];
}

class Cell {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

const place = (c, list) => {
    if (c.val > list.val) {
        c.next = list;
        return c;
    }

    let p = list, pp = null;
    while (p && c.val < p.val) {
        pp = p;
        p = p.next;
    }
    if (!p || p.val !== c.val) {
        pp.next = c;
        c.next = p;
    }

    return list;
}
