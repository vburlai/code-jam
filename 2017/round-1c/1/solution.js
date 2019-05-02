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
    let RR = [];
    let RH = [];
    for (let i = 0; i < N; i++) {
        const [ r, h ] = (yield).map(Number);
        RR.push(r * r);
        RH.push(2 * r * h);
    }
    
    let ind = Array.from({ length: N }, (_, i) => i);
    ind.sort((i1, i2) => RH[i2] - RH[i1]);

    let result = 0;
    let maxr = 0;
    let used = new Set();
    for (let i = 0; i < K; i++) {
        result+=RH[ind[i]];
        used.add(ind[i]);
        if (RR[ind[i]] > RR[maxr]) {
            maxr = ind[i];
        }
    }

    let maxr2 = maxr;
    for (let i = 0; i < N; i++) {
        if (!used.has(i)) {
            if (RH[i] + RR[i] > RH[maxr2] + RR[maxr2]) {
                maxr2 = i;
            }
        }
    }
    result-=RH[maxr];
    result+=RH[maxr2] + RR[maxr2];
    result*=Math.PI;

    console.log(`Case #${cs}: ${result}`);
});
