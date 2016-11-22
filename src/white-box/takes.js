const assert = require('assert');
const R = require('ramda');
const {assertionMessage, prepareEff, retrieveEff} = require('./message');
const {sagaSignature} = require('./helpers');
const {gets} = require('./actions');

const testerFn = (helperName, effCreatorName) =>
  (value, buffer) => ({value: step = {}} = {}) => {
    const pattern = R.is(Object, value) && !R.isArrayLike(value) ?
      value.type : value || '*';
    assert(pattern, `If you pass an object to the "${helperName}" helper, ` +
                    'it should contain a type property. Passed: ' +
                    `${helperName}(${JSON.stringify(value)})`);
    const expectedEff = (effName = effCreatorName) => [effName, [pattern]];

    assert(step[sagaSignature],
      assertionMessage(expectedEff(), []));

    const {name: effName, eff} = retrieveEff(step);
    const err = assertionMessage(
      expectedEff(`${effCreatorName}${eff.maybe ? 'm' : ''}`),
      prepareEff(step)
    );

    assert(effName === effCreatorName, err);
    if (R.is(Array, eff.pattern)) {
      if (R.is(Array, pattern)) {
        assert.deepEqual(pattern, eff.pattern, err);
      } else {
        assert(R.contains(pattern, eff.pattern),
          `The list of patterns ${JSON.stringify(eff.pattern)} does not ` +
          `contain the pattern ${pattern}.
          ${err}`);
      }
    } else if (R.is(Function, eff.pattern)) {
      assert(R.is(Object, value),
        `To test a function that was passed to the ${effCreatorName} effect, ` +
        `you have to pass a sample action to the ${helperName} helper`
      );

      let result;
      try {
        result = eff.pattern(value);
      } catch (err) {
        assert(false,
          `An error "${err.message}" was occured when the ` +
          `function that had been passed to the ${effCreatorName} effect was ` +
          'executed with argument: ' + JSON.stringify(eff));
      }
      assert(result,
        'An action does not match the function that was passed ' +
        `to the ${effCreatorName} effect. It returns: "${result}"`);
    } else {
      if (effName === 'actionChannel') {
        assert.deepEqual(buffer, eff.buffer, err);
      }
      assert(pattern === eff.pattern, err);
    }
  };

module.exports = value => {
  const pipeline = [testerFn('takes', 'take')(value)];
  if (R.isArrayLike(value)) {
    return pipeline;
  } else if (R.is(String, value)) {
    return [...pipeline, gets({type: value})];
  }
  return [...pipeline, gets(value)];
};

module.exports.testerFn = testerFn;
