'use strict';

const toInt = i => parseInt(i, 10);
const { Console } = require('console');
const console = new Console({ stdout: process.stdout, stderr: process.stderr });
const jam = (generator, countCases = true) => {
    let cases = 1, cs = 1, iter = null;
    const reset = () => { iter = generator(cs); iter.next(); }, { stdin, stdout } = process;
    const reader = require('readline').createInterface({ input: stdin, output: stdout, terminal: false });
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

jam(function* (cs) {
    const [N] = (yield).map(toInt);

    const prefixes = [''];
    const suffixes = [''];
    let middle_parts = [];

    for (let i = 0; i < N; i++) {
        const [s] = yield;
        const [pref, ...rest] = s.split('*');
        const suff = rest.pop()
        middle_parts = [...middle_parts, ...rest];
        prefixes.push(pref);
        suffixes.push(suff);
    }

    prefixes.sort(byLengthDesc);
    suffixes.sort(byLengthDesc);

    let result = `${prefixes[0]}${middle_parts.join('')}${suffixes[0]}`;

    if (invalidPrefixes(prefixes, prefixes[0]) ||
        invalidSuffixes(suffixes, suffixes[0])) {
        result = '*'
    }

    console.log(`Case #${cs}: ${result}`);
});

const byLengthDesc = (a, b) => b.length - a.length;

/** @param {string} s */
const endsWith = (s, end) =>
    s.lastIndexOf(end) + end.length === s.length

/** @param {string} s */
const startsWith = (s, start) =>
    s.substr(0, start.length) === start

/** @param {array} arr */
const invalidPrefixes = (arr, s) =>
    arr.some(el => !startsWith(s, el))

/** @param {array} arr */
const invalidSuffixes = (arr, s) =>
    arr.some(el => !endsWith(s, el))
