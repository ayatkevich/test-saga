const assert = require('assert');
const {namedFn} = require('./message');
const {assertionMessage, prepareEff, retrieveEff} = require('./message');
const {sagaSignature} = require('./helpers');

module.exports = forkSignature => ({value: step = {}} = {}) => {
  const errMsg = (got = prepareEff(step)) =>
    assertionMessage(['join', [namedFn('[Task]')]], got);

  assert(step && step[sagaSignature],
    errMsg([]));

  const {name, eff} = retrieveEff(step);
  assert.equal(name, 'join',
    errMsg());
  if (forkSignature) {
    assert.equal(eff.__signature__, forkSignature,
      `The passed Task is not signed with ${forkSignature}`);
  }
};
