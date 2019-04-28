'use strict';

class Jam {
    constructor(func, dontCountTestCases = false) {
        this.func = func;
        this.cases = 1;
        this.caseNumber = 1;
        this.inTask = dontCountTestCases;
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

new Jam(function* (line1) {
    const [ T ] = line1.map(Number);

    for (let i = 1; i <= T; i++) {
        let res = Array.from({ length: 6 }, () => 0);

        const num1 = parseInt(yield 220, 10);
        const r6base = Math.pow(2, 36);
        const r5base = Math.pow(2, 44);
        const r4base = Math.pow(2, 55);
        res[5] = num1/r6base%128;
        res[4] = Math.floor(num1/r5base)%128;
        res[3] = Math.floor(num1/r4base)%128;
    
        const num2 = parseInt(yield 54, 10);
        const r4base2 = Math.pow(2, 13);
        const r3base = Math.pow(2, 18);
        const r2base = Math.pow(2, 27);
        const r1base = Math.pow(2, 54);
        res[2] = Math.floor((num2 - res[3] * r4base2)/r3base)%128;
        res[1] = Math.floor(num2/r2base)%128;
        res[0] = Math.floor(num2/r1base)%128;
    
        const [ verdict ] = yield res.join(' ');
        if (verdict === '-1') {
            process.exit(0);
        }
    }
}, true);
