const assert = require('assert');
const R = require('ramda');
const {sagaSignature} = require('./helpers');
const {
  assertionMessage, prepareEff, retrieveEff, namedFn} = require('./message');

module.exports = (fn, ...args) => ({value: step = {}} = {}) => {
  const expectedEffNames = ['call', 'cps', 'fork', 'spawn'];
  const [defaultEffName] = expectedEffNames;
  const expectedArgs = [R.is(String, fn) ? namedFn(fn) : fn, ...args];

  assert(fn,
    'You have to pass at least a name for the function ' +
    'that expected to be called');

  assert(step && step[sagaSignature],
    assertionMessage([defaultEffName, expectedArgs], []));

  const {name: effName, eff} = retrieveEff(step);
  const err = assertionMessage([
    R.find(R.equals(effName), expectedEffNames) || defaultEffName,
    expectedArgs
  ], prepareEff(step));

  assert(eff, err);

  if (R.type(fn) === 'Function') {
    assert(fn === eff.fn, err);
  }

  if (R.type(fn) === 'Array' || eff.context) {
    assert(R.is(Array, fn) && fn.length === 2 && Boolean(eff.context), err);
  }

  assert.deepEqual(eff.args, args, err);
};
