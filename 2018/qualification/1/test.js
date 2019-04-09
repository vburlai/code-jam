'use strict';

const exit = () => process.exit(0);
const reader = {
  _: require('readline').createInterface({ input: process.stdin, terminal: false })
    .on('end', exit)
    .on('line', l => reader.pushLine(l)),
  _buffer: [], _promises: [],
  _ack: () => reader._buffer.length && reader._promises.length &&
    reader._promises.shift()(reader._buffer.shift()),
  pushLine: line => { reader._buffer.push(line); reader._ack(); },
  getLine: () => new Promise(res => { reader._promises.push(res); reader._ack(); }),
  getNumbers: () => reader.getLine().then(l => l.split(' ').map(n => parseInt(n, 10))),
  getStrings: () => reader.getLine().then(l => l.split(' '))),
};

reader.getNumbers().then([testCases] => {
  console.log('testCases:'+testCases);
  let tc = 1;

  testCase(tc).then(() => {
    if (tc++ === testCase) { exit() }
  })
  reader.getLine().then(l2 => {
    console.log('2:'+l2);
    reader.getLine().then(l3 => {
      console.log('3:'+l3);
      exit();
    });
  });
});
