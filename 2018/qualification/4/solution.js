'use strict';

const reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let state = 'COUNTER';
let counter = 0;
let caseNumber = 1;

reader.on('line', line => {
    switch (state) {
        case 'COUNTER':
            counter = parseInt(line, 10);
            state = 'TASK';
            break;

        case 'TASK':
            const num = parseFloat(line);
            console.log(`Case #${ caseNumber++ }:`);
            console.log(solution(num));
            state = (caseNumber > counter) ? 'DONE' : 'TASK';
            break;

    }
});

const solution = num => 
    num <= Math.SQRT2 ? simpleSolution(num) : advancedSolution(num);

const simpleSolution = num => {
    const alpha = Math.PI/4 - Math.acos(num / Math.SQRT2);
    const x1 = 0.5 * Math.sin(alpha);
    const y1 = 0.5 * Math.cos(alpha);
    const y2 = x1;
    const x2 = -y1;
    return [
        `${x1} ${y1} 0`,
        `${x2} ${y2} 0`,
        '0 0 0.5'
    ].join('\n');
};

const advancedSolution = num => {
    const beta = Math.asin((num - Math.sqrt(6 - 2 * num * num)) / 3);
    const sqrt2quarter = Math.SQRT2/4;
    const p1 = [ sqrt2quarter, sqrt2quarter, 0 ];
    const p2 = [ -sqrt2quarter, sqrt2quarter, 0 ];
    const p3 = [ 0, 0, 0.5 ];
    const p1r = rotateX(p1, beta);
    const p2r = rotateX(p2, beta);
    const p3r = rotateX(p3, beta);
    return [
        p1r.join(' '),
        p2r.join(' '),
        p3r.join(' ')
    ].join('\n')
};

const rotateX = (point, angle) => {
    return [
        point[0],
        point[1] * Math.cos(angle) - point[2] * Math.sin(angle),
        point[2] * Math.cos(angle) + point[1] * Math.sin(angle)
    ]
}