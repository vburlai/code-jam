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

new Jam(function* (line1) {
    const [ N, B ] = line1.map(n => parseInt(n, 10));

    let responses = [];
    let lookup = [];
    let test;
    let response;

    for (let step = 1; step <= 16; step*=2) {
        test = genTest(step, N);
        lookup = updateLookup(lookup, test);
        [ response ] = yield test;
        responses.push(response);
    }
    
    let broken = [];
    lookup.forEach((expected, ind) => {
        const received = responses.map(r => r[ind - broken.length]).join('');
        if (expected !== received){
            broken.push(ind);
        }
    });

    const [ res ] = yield broken.join(' ');
    if (res === '-1') {
        process.exit(0);
    }
});

const genTest = (step, N) => {
    let res = '';
    let bit = false;
    let count = 0;

    while (res.length < N) {
        res = `${res}${bit ? '1' : '0'}`;
        if (++count >= step) {
            bit = !bit;
            count = 0;
        }
    }
    return res;
};

const updateLookup = (lookup, test) => test.split('')
    .map((t, ind) => `${lookup[ind] || ''}${t}`);
