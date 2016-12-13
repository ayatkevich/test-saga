const assert = require('assert');
const {createMockTask} = require('redux-saga/utils');

const gets = value => ({value, action: 'next'});
const throws = value => ({value, action: 'throw'});

const signedTask = forkSignature => {
  assert(forkSignature,
    'signedTask(forkSignature): you have to pass a signature as a param');
  const task = createMockTask();
  task.__signature__ = forkSignature;
  return task;
};

module.exports = {gets, throws, signedTask};
