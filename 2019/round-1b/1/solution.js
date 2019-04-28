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

let caseNumber = 1;
new Jam(function* (initialLine1) {
    const [ P, Q ] = initialLine1.map(str => parseInt(str, 10));

    const x = Array.from({ length: Q+1 }, () => 0);
    const y = Array.from({ length: Q+1 }, () => 0);

    for(let i = 0; i < P; i++) {
        const [ xstr, ystr, dir ] = yield;
        const xval = parseInt(xstr, 10);
        const yval = parseInt(ystr, 10);
        switch (dir) {
            case 'N':
                for (let j = yval+1; j <= Q; j++) {
                    y[j]++;
                }
                break;
            
            case 'S':
                for (let j = yval - 1; j >= 0; j--) {
                    y[j]++;
                }
                break;
            
            case 'E':
                for (let j = xval + 1; j <= Q; j++) {
                    x[j]++;
                }
                break;

            case 'W':
                for (let j = xval - 1; j >= 0; j--) {
                    x[j]++;
                }
                break;
        }
    }

    let xpos = 0;
    let xmax = x[0];
    let ypos = 0;
    let ymax = y[0];
    for (let i = 0; i <= Q; i++) {
        if (x[i] > xmax) {
            xpos = i;
            xmax = x[i];
        }
        if (y[i] > ymax) {
            ypos = i;
            ymax = y[i];
        }
    }

    return `Case #${ caseNumber++ }: ${ xpos } ${ ypos }`
});
