const testSaga = (saga, steps) => {
  const generator = saga();
  let next = {action: 'next'};

  for (const step of steps) {
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

const gets = value => ({value, action: 'next'});
const throws = value => ({value, action: 'throw'});

module.exports = {
  testSaga,
  gets,
  throws,
  calls: require('./calls')
};
