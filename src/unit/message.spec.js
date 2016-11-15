const test = require('ava');
const {assertionMessage, getEffName, prepareEff} = require('./message');

function fnName() {}

test('assertionMessage', t => {
  t.is(assertionMessage(
    ['call', [
      'fnName', 1, true, 'string', {}, [], null]],
    ['call', [
      fnName, 0, false, () => {}, {a: 1}, [1]]]), `
    Expected:
      yield call("fnName", 1, true, "string", {}, [], null);
    Got:
      yield call(fnName, 0, false, function () {}, {"a":1}, [1]);
  `);

  t.is(assertionMessage(
    ['call', [
      'fnName', 1, true, 'string', {}, [], null]],
    []), `
    Expected:
      yield call("fnName", 1, true, "string", {}, [], null);
    Got:
      nothing
  `);
});

test('getEffName', t => {
  t.is(getEffName(), undefined);
  t.is(getEffName({}), undefined);
  t.is(getEffName({a: 1, b: 2, c: 3}), undefined);
  t.is(getEffName({A: 1, b: 2, c: 3}), 'a');
  t.is(getEffName({A: 1, B: 2, C: 3}), 'a');
});

test('prepareEff', t => {
  t.deepEqual(
    prepareEff(),
    []
  );
  t.deepEqual(
    prepareEff({CALL: {fn: 'fn', args: [1, 2, 3]}}),
    ['call', ['fn', 1, 2, 3]]
  );
  t.deepEqual(
    prepareEff({TAKE: {pattern: 'action'}}),
    ['take', ['action']]
  );
  t.deepEqual(
    prepareEff({UNKNOWN: {x: 1, y: 2}}),
    ['unknown']
  );
});
