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
    const [A] = (yield).map(Number);
    let C = [];
    while (C.length < A) {
        const [ ci ] = yield;
        C.push(ci);
    }

    const LIMIT = 500;
    const MOVES = ['R', 'S', 'P'];
    let lost = new Set();
    let result = '';
    for (let i = 0; i < LIMIT && lost.size < A; i++) {
        let found = false;
        let maxkills = -1;
        for (let m of MOVES) {
            const oponents = C.filter((el, ind) => !lost.has(ind)).map(el => el[i%el.length]);
            if (rightMove(m, oponents)) {
                const k = kills(m, oponents);
                if (k > maxkills) {
                    maxkills = k;
                    found = m;
                }
                // console.error(`[${i}] found=${found}, rightMove - ${m}, kills - ${k} maxkills - ${maxkills}, result - ${result}`)
            }
        }
        if (found) {
            result+=found;
            for (let j = 0; j < A; j++) {
                if (!lost.has(j)) {
                    if (winMoves[found] === C[j][i%C[j].length]) {
                        lost.add(j)
                    }
                }
            }
            // console.error(`found=${found}, lost = ${[...lost.keys()]}`)
        } else {
            console.log(`Case #${cs}: IMPOSSIBLE`);
            return;
        }
    }
    if (lost.size < A) {
        console.log(`Case #${cs}: IMPOSSIBLE`);
        return;
    }

    console.log(`Case #${cs}: ${result}`);
});

const winMoves = {
    P: 'R', // paper wins over rock
    R: 'S',
    S: 'P'
}

const rightMove = (m, arr) => 
    arr.reduce((acc, el) => 
        acc && winMoves[el] !== m,
    true)

const kills = (m, arr) =>
    arr.reduce((acc, el) =>
        acc + (winMoves[m] === el) ? 1 : 0,
    0)