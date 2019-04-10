'use strict';

class Jam {
    constructor(func) {
        this.func = func;
        this.cases = 0;
        this.caseNumber = 1;
        this.inTask = false;
        this.reset = () => { this.input = []; this.iter = null; };
        this.reset();
        const { stdin: input, stdout: output } = process;
        const reader = require('readline').createInterface({ input, output, terminal: false});
        reader.on('line', this.onLine.bind(this));
    }

    onLine(line) {
        let caseFinished;
        
        if (!this.inTask) {
            this.cases = parseInt(line, 10);
            this.inTask = true;
            this.reset();
            return;
        }

        if (this.iter) {
            const { value, done } = this.iter.next(line.split(' '));
            if (value) console.log(value);
            caseFinished = done;
        } else {
            this.input.push(line.split(' '));

            if (this.input.length === this.func.length) {
                const res = this.func.apply(null, this.input);

                if (typeof res.next === 'function') {
                    this.iter = res;
                    const { value, done } = this.iter.next();
                    if (value) console.log(value);
                    caseFinished = done;
                } else {
                    console.log(`Case #${ this.caseNumber }: ${ res }`);
                    caseFinished = true;
                }
                
            }
        }

        if (caseFinished) {
            this.caseNumber++;
            this.reset();
        }

        if (this.caseNumber > this.cases) {
            process.exit(0);
        }
    }
}

new Jam(function* ([ A ]) {
    const N = A === '200' ? 23 : 3;
    const cells = Array.from({ length: N }, () => new Set());
    let limit = 1000;

    while (cells.some(incomplete) && --limit) {
        for(let i = 0; i < cells.length; i++) {
            if (incomplete(cells[i])) {
                const shot = toXY(i);
                const response = yield shot;
                if (response === '-1 -1') {
                    process.exit(0);
                }
                if (response === '0 0') {
                    return;
                }
                cells[i].add(response.join(','));
            }
        }
    }
});

const incomplete = c => c.size < 9;
const toXY = ind => `2 ${ind*3 + 2}`;

