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
    let options = Array.from({ length: 119 }, (el, ind) => 1 + 5 * ind);
    
    let result = '';
    while (options.length > 1) {
        let pos = {};
        for (let o of options) {
            console.log(o);
            const [s] = yield;
            if (s === 'N') {
                process.exit(0);
            }
            pos[s] = [...(pos[s]||[]), o + 1];
        }
        options = [];
        let letter = '';
        for (let l of 'ABCDE'.split('')) {
            if (pos[l] && (!options.length || pos[l].length < options.length)) {
                if (options.length) {
                    
                }
                options = pos[l];
                letter = l;
            }
        }
        result+=letter;
        // console.error(`[${result}] options=${options}`);
    }
    console.log(options[0]+1);
    const [s2] = yield;
    result += s2;
    for (let l of 'ABCDE'.split('')) {
        if (result.indexOf(l) === -1) {
            result += l;
        }
    }
    console.log(result);
    // console.error(result);
    const [s] = yield;
    if (s === 'N') {
        process.exit(0);
    }
});
