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

new Jam((line1, line2, line3) => {
    const [ N, K ] = line1.map(str => parseInt(str, 10));
    const skill1 = line2.map(str => parseInt(str, 10));
    const skill2 = line3.map(str => parseInt(str, 10));
    
    let res = 0;
    for(let i = 0; i < N; i++) {
        for(let len = 1; len <= N - i; len++) {
            const max1 = max(skill1.slice(i, i+len));
            const max2 = max(skill2.slice(i, i+len));
            if (Math.abs(max1 - max2) <= K) {
                res++;
            }
        }
    }

    return res;
});

const max = arr => arr.reduce((acc, el) => Math.max(acc, el));
