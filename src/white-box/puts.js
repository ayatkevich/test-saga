const assert = require('assert');
const R = require('ramda');
const {assertionMessage, prepareEff, retrieveEff} = require('./message');
const {sagaSignature} = require('./helpers');

module.exports = action => ({value: step = {}} = {}) => {
  assert(action, 'puts(action) requires action argument');

  const expectedEffNames = ['put', 'put.sync'];
  const expectedEff = (effName = expectedEffNames[0]) => [effName, [action]];

  assert(step[sagaSignature],
    assertionMessage(expectedEff(), []));

  const {name: effName, eff} = retrieveEff(step);
  const err = assertionMessage(expectedEff(
    R.indexOf(effName, expectedEffNames) === -1 ? undefined : effName
  ), prepareEff(step));

  assert(R.indexOf(effName, expectedEffNames) !== -1, err);
  if (typeof action === 'function') {
    assert(action(eff.action), `The action ${JSON.stringify(action)} does ` +
                               'not meet a function that was passed as an ' +
                               'argument to the "puts" helper.');
  } else {
    assert.deepEqual(action, eff.action, err);
  }
};
