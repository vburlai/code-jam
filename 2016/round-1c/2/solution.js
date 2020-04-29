'use strict';

const toInt = i => parseInt(i, 10);
const arrFr = (length, gen) => Array.from({ length }, gen);
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
    const [B, M] = (yield).map(toInt);
    const graph = arrFr(B, () => arrFr(B, () => 0));
    let found = false;
    const rec = (i, j) => {
        if (found) {
            return
        }
        if (i >= B || j >= B) {
            if (isMatching(graph, B, M)) {
                found = true;
            }
            return
        }
        if (j > i) {
            graph[i][j] = 1
            rec(j === B - 1 ? (i + 1) : i, j === B - 1 ? (i + 2) : (j + 1))
        }
        if (!found) {
            graph[i][j] = 0
            rec(j === B - 1 ? (i + 1) : i, j === B - 1 ? (i + 2) : (j + 1))
        }
    }
    rec(0, 1)
    console.log(`Case #${cs}: ${found ? 'POSSIBLE' : 'IMPOSSIBLE'}`);
    if (found) {
        printMatrix(graph);
    }
});


const printMatrix = m => console.log(m.map(a => a.join('')).join('\n'))

const isMatching = (graph, B, M) => {
    let paths = 0;
    const visited = arrFr(B, () => false);
    let cycles = false;
    const hasEnd = arrFr(B, (v, i) => i).some(ind => graph[ind][B - 1])
    if (!hasEnd) {
        return false;
    }

    const dfs = i => {
        if (cycles) {
            return
        }
        if (i == (B - 1)) {
            paths++;
        }
        if (visited[i]) {
            cycles = true;
            return
        }
        visited[i] = true;
        for (let j in graph[i]) {
            if (graph[i][j]) {
                dfs(j)
            }
        }
        visited[i] = false;
    }

    dfs(0)

    return !cycles && M === paths;
}
