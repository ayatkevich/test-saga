const {testerFn} = require('./takes');
const {gets} = require('./actions');

module.exports = (value, buffer) => [
  testerFn('createsChannel', 'actionChannel')(value, buffer),
  gets(value)
];
