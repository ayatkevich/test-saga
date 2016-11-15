const assert = require('assert');
const R = require('ramda');
const {assertionMessage, prepareEff} = require('./message');
const {sagaSignature, namedFn} = require('./helpers');

module.exports = (fn, ...args) => ({value: step = {}} = {}) => {
  const expected = ['call', [R.is(String, fn) ? namedFn(fn) : fn, ...args]];

  assert(fn,
    'You have to pass at least a name for the function ' +
    'that expected to be called');

  assert(step && step[sagaSignature],
    assertionMessage(expected, prepareEff()));

  const err = assertionMessage(expected, prepareEff(step));

  assert(step.CALL, err);

  if (typeof fn === 'function') {
    assert(fn === step.CALL.fn, err);
  }

  assert.deepEqual(step.CALL.args, args, err);
};
