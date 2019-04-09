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
    const numbers = numbersStr.map(n => BigInt(n));
    let primes = new Set();
    
    numbers.slice(0, -1).forEach((num, ind) => {
        if (num !== numbers[ind + 1]) {
            const prime = gcd(num, numbers[ind + 1]);
            primes.add(prime);
            primes.add(num/prime);
            primes.add(numbers[ind + 1]/prime);
        }
    });

    const sortedPrimes = [...primes.keys()].sort(bigintSort);
    let letters = {};

    sortedPrimes.forEach((p, ind) => {
        letters[p] = String.fromCharCode(65 + ind);
    });

    for(let prime of sortedPrimes) {
        const res = numbers.reduce(reducer(letters), { prime, str: letters[prime] });

        if (res) {
            return res.str;
        }
    };
});

const reducer = letters => (acc, n) => {
    if (!acc) return;
    const { prime, str } = acc;
    if(n % prime !== 0n) return;
    const nextPrime = n / prime;

    return {
        prime: nextPrime,
        str: `${str}${letters[nextPrime]}`
    };
};

const bigintSort = (a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}

const gcd = (a, b) => {
    if (b === 0n) {
        return a;
    } else {
        return gcd(b, a % b);
    }
};