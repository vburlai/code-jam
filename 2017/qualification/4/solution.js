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
    const [ N, M ] = (yield).map(Number);

    let X = Array.from({ length: N },
        () => Array.from({ length: N }, () => 0)
    );
    let P = Array.from({ length: N },
        () => Array.from({ length: N }, () => 0)
    );

    for(let i = 0; i < M; i++) {
        const [ S, R, C ] = yield;
        if (S === 'o' || S === 'x') {
            X[R-1][C-1] = 1;
        }
        if (S === 'o' || S === '+') {
            P[R-1][C-1] = 1;
        }
    }

    let changes = new Map();

    let usedR = new Set();
    let usedC = new Set();

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (X[i][j]) {
                usedR.add(i);
                usedC.add(j);
            }
        }
    }

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (!usedR.has(i) && !usedC.has(j)) {
                X[i][j] = 1;
                changes.set(`${i+1} ${j+1}`, P[i][j] ? 'o' : 'x');
                usedR.add(i);
                usedC.add(j);
            }
        }
    }

    let usedD1 = new Set();
    let countD1 = new Map();
    let countAllD1 = new Map();
    let usedD2 = new Set();
    let countD2 = new Map();
    let countAllD2 = new Map();

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            countAllD1.set(i + j, (countAllD1.get(i + j) || 0) + 1);
            countAllD2.set(i - j, (countAllD2.get(i - j) || 0) + 1);
            if (!P[i][j]) {
                countD1.set(i + j, (countD1.get(i + j) || 0) + 1);
                countD2.set(i - j, (countD2.get(i - j) || 0) + 1);
            } else {
                usedD1.add(i + j);
                usedD2.add(i - j);
            }
        }
    }

    const order = [...countD1.keys()];
    order.sort(
        (k1, k2) => countD1.get(k1) - countD1.get(k2)
    );

    const order2 = [...countD2.keys()];
    order2.sort(
        (k1, k2) => countD2.get(k1) - countD2.get(k2)
    );
    
    order.forEach(d1 => {
        for (let d2 of order2) {
            const i = (d1 + d2) / 2;
            const j = (d1 - d2) / 2;
            if (i%1 === 0 && j%1 === 0 && i >= 0 && j >= 0 && i < N && j < N && !usedD1.has(d1) && !usedD2.has(d2)) { 
                P[i][j] = 1;
                changes.set(`${i + 1} ${j + 1}`, X[i][j] ? 'o' : '+');
                usedD1.add(d1);
                usedD2.add(d2);
            }
        }
    })

    let result = 0;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            result+=X[i][j] + P[i][j];
        }
    }

    console.log(`Case #${cs}: ${result} ${changes.size}`);
    if (changes.size) {
        console.log([...changes.keys()].map(k => `${changes.get(k)} ${k}`).join('\n'));
    }
});
