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

let deck;

jam(function* (cs) {
    const [R, S] = (yield).map(toInt);
    const RS = R * S;
    deck = creatDeck(R, S)
    const order = Array.from({ length: RS }, (v, k) => k);

    let best = null;

    const rec = (order, steps) => {
        if (isOk(order, R)) {
            if (best === null || steps.length < best.length) {
                best = steps;
            }
        }
        if (steps.length < RS) {
            for (let a = 1; a < RS - 1; a++) {
                for (let b = 1; b < RS - a; b++) {
                    rec(newOrder(order, a, b), [...steps, `${a} ${b}`])
                }
            }
        }
    }
    rec(order, []);

    console.log(`Case #${cs}: ${best.length}`);
    console.log(best.join('\n'))
});

const creatDeck = (R, S) => {
    const res = [];
    for (let r = 1; r <= R; r++) {
        for (let s = 1; s <= S; s++) {
            res.push([r, s])
        }
    }
    console.error(res.join(', '))
    return res;
}

const isOk = (order, R) => {
    for (let i in order) {
        const s = deck[order[i]][1] - 1;
        const expect = Math.floor(i / R)
        if (s != expect) {
            return false
        }
    }
    return true;
}

const newOrder = (order, a, b) => {
    const result = [
        ...order.slice(a, a + b),
        ...order.slice(0, a),
        ...order.slice(a + b),
    ]
    return result;
}