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
    const [AC, AJ] = (yield).map(Number);
    let slots = [];
    let time = {
        C: 12*60,
        J: 12*60,
    };
    while (slots.length < AC + AJ) {
        const [s, e] = (yield).map(Number);
        const c = slots.length < AC ? 'C' : 'J';
        time[c]-=e - s;
        slots.push([s, e, c]);
    }
    slots.sort((a, b) => a[0] - b[0]);
    const [s, e, c] = slots[0];
    slots.push([s + 24*60, e + 24*60, c]);

    let result = 0;
    let gaps = [];
    for(let i = 1; i < slots.length; i++) {
        if (slots[i][2] === slots[i-1][2]) {
            if (slots[i][0] > slots[i-1][1]) {
                gaps.push([slots[i][0] - slots[i-1][1], slots[i][2]]);
            }
        } else {
            result++;
        }
    }
    gaps.sort((a, b) => a[0] - b[0]);
    gaps.forEach(([size, c]) => {
        if (time[c] >= size) {
            time[c] -=size;
        } else {
            time[c] = 0;
            result+=2;
        }
    })

    console.log(`Case #${cs}: ${result}`);
});
