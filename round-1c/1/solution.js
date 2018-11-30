'use strict';

const reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let state = 'COUNTER';
let counter = 0;
let caseNumber = 1;
let N, L;
let counter2;
let words;
let obj;

reader.on('line', line => {
    switch (state) {
        case 'COUNTER':
            counter = parseInt(line, 10);
            state = 'TASK1';
            break;
        
        case 'TASK1':
            const args = line.split(' ');
            N = parseInt(args[0], 10);
            L = parseInt(args[1], 10);
            counter2 = 0;
            state = 'TASK2';
            words = [];
            break;
        
        case 'TASK2':
            words[counter2++] = line;
            if (counter2 === N) {
                console.log(`Case #${ caseNumber++ }: ${ solution(L) }`);
                state = (caseNumber > counter) ? 'DONE' : 'TASK1';
            };
            break;
    }
});

const solution = (L) => {
    obj = buildObject('', L);
    if (!isPossible(obj)) {
        return '-';
    };

    let res = obj[0].letters.map(l => buildWord(1, l)).filter(r => r !== null);
    return res[0];
};

const buildWord = (pos, start) => {
    if (pos === L) {
        return start;
    };
    const subObj = buildSubobject(pos, start);
    
    if (subObj.count < obj[pos].count) {
        return obj[pos].letters.filter(l => !subObj[l]).map(l => {
            const res = buildWord(pos + 1, start + l);
            return res === null ? null : res;
        }).filter(r => r !== null)[0];
    } else {
        return null;
    };
};

const buildSubobject = (pos, start) => {
    let res = {count: 0, letters: []};
    for (let j = 0; j < N; j++) {
        if (words[j].substring(0, start.length) === start) {
            const c = words[j][pos];
            if (res[c]) {
                res[c]++;
            } else {
                res[c] = 1;
                res.count++;
                res.letters.push(c);
            }
        };
    };
    return res;
}

const buildObject = (start, end) => {
    let res = (new Array(L)).fill({count: 0});
    for (let i = start.length; i < end; i++) {
        res[i] = buildSubobject(i, start);
    }
    return res;
};

const wordsCount = obj => obj.reduce((acc, el) => acc * el.count, 1);

const isPossible = obj => N < wordsCount(obj);
