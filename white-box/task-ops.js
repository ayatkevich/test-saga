const assert = require('assert');
const {gets} = require('./actions');
const {namedFn} = require('./message');
const {assertionMessage, prepareEff, retrieveEff} = require('./message');
const {sagaSignature} = require('./helpers');

const op = effName => forkSignature => ({value: step = {}} = {}) => {
  const errMsg = (got = prepareEff(step)) =>
    assertionMessage([effName, [namedFn('[Task]')]], got);

  assert(step && step[sagaSignature], errMsg([]));

  const {name, eff} = retrieveEff(step);
  assert.equal(name, effName, errMsg());
  if (forkSignature) {
    assert.equal(
      eff.__signature__,
      forkSignature,
      `The passed Task is not signed with ${forkSignature}`
    );
  }
};

module.exports = {
  joins: op('join'),
  cancels: op('cancel'),
  isCancelled: () => [
    ({value: step = {}} = {}) => {
      const errMsg = (got = prepareEff(step)) =>
        assertionMessage(['cancelled', []], got);

      assert(step && step[sagaSignature], errMsg([]));

      const {name} = retrieveEff(step);
      assert.equal(name, 'cancelled', errMsg());
    },
    gets(true)
  ]
};
