const assert = require('assert');
const {sagaSignature} = require('./helpers');
const {assertionMessage, retrieveEff} = require('./message');
const {gets} = require('./actions');

const selects = (expected, state) => ({value: step = {}} = {}) => {
  assert(expected,
    'selects(expected).from(state): expected cannot be empty');
  assert(state,
    'selects(expected).from(state): state cannot be empty');
  assert(step && step[sagaSignature],
    assertionMessage(['select', []], []));

  const {eff} = retrieveEff(step);

  const result = eff.selector(state, ...eff.args);
  assert.deepEqual(expected, result,
    'The result of the function that was passed to the select effect creator ' +
    `does not equal to the expected result.
    Expected: ${JSON.stringify(expected)}
    Got: ${JSON.stringify(result)}`);
};

module.exports = res => ({from: state => [selects(res, state), gets(res)]});
