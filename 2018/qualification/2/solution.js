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

new Jam((_, numbersStr) => {
    const numbers = numbersStr.map(s => parseInt(s, 10));
    const arr1 = numbers.filter((_, ind) => ind % 2 === 0);
    const arr2 = numbers.filter((_, ind) => ind % 2 === 1);

    arr1.sort((a, b) => a - b);
    arr2.sort((a, b) => a - b);

    const merged = arr1.reduce((acc, el, ind) => acc.concat(el, arr2[ind]), []);
    for (let ind = 0; ind < merged.length - 1; ind++) {
        if (merged[ind] > merged[ind + 1]) {
            return ind;
        } 
    };

    return 'OK';
});
