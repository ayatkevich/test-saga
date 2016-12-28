const R = require('ramda');

const {gets, throws, signedTask} = require('./actions');
const {joins, cancels} = require('./task-ops');

const testSaga = (saga, steps) => {
  const generator = saga();
  let next = {action: 'next'};

  for (const step of R.flatten(steps)) {
    if (typeof step !== 'undefined' && step && step.action) {
      next = step;
      continue;
    }
    if (typeof step !== 'function') {
      continue;
    }
    step(generator[next.action](next.value));
  }
};

module.exports = {
  testSaga,
  gets,
  throws,
  calls: require('./calls'),
  takes: require('./takes'),
  createsChannel: require('./creates-channel'),
  puts: require('./puts'),
  selects: require('./selects'),
  joins,
  cancels,
  signedTask
};
