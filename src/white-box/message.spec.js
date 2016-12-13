const test = require('ava');
const R = require('ramda');
const {
  assertionMessage, retrieveEff, prepareEff, namedFn} = require('./message');

function fnName() {}

test('namedFn', t => {
  const fn = namedFn('named');
  t.is(R.type(fn), 'Function');
  t.is(fn.name, 'named');
  t.notThrows(() => fn());
});

test('assertionMessage', t => {
  const expected = ['call', ['fnName', 1, true, 'string', {}, [], null]];
  const expectedMessage = `Expected:
      yield call("fnName", 1, true, "string", {}, [], null);`;

  t.is(assertionMessage(
    expected,
    ['call', [
      fnName, 0, false, () => {}, {a: 1}, [1]]]), `
    ${expectedMessage}
    Got:
      yield call(fnName, 0, false, function () {}, {"a":1}, [1]);
  `);

  t.is(assertionMessage(
    expected,
    ['call', [
      [{b: 2}, fnName], 0, false, () => {}, {a: 1}, [1]]]), `
    ${expectedMessage}
    Got:
      yield call([{"b":2}, fnName], 0, false, function () {}, {"a":1}, [1]);
  `);

  t.is(assertionMessage(
    expected,
    []), `
    ${expectedMessage}
    Got:
      nothing
  `);
});

test('retrieveEff', t => {
  t.deepEqual(retrieveEff(), {name: undefined, eff: {}});
  t.deepEqual(retrieveEff({}), {name: undefined, eff: {}});
  t.deepEqual(retrieveEff({a: 1, b: 2, c: 3}), {name: undefined, eff: {}});
  t.deepEqual(retrieveEff({A: 1, b: 2, c: 3}), {name: 'a', eff: 1});
  t.deepEqual(retrieveEff({A: 1, B: 2, C: 3}), {name: 'a', eff: 1});
  t.deepEqual(
    retrieveEff({FORK: {a: 1, detached: true}}),
    {name: 'spawn', eff: {a: 1, detached: true}}
  );
  t.deepEqual(
    retrieveEff({PUT: {a: 1, sync: true}}),
    {name: 'put.sync', eff: {a: 1, sync: true}}
  );
});

test('prepareEff', t => {
  t.deepEqual(
    prepareEff({UNKNOWN: {x: 1, y: 2}}),
    ['unknown']
  );
});

test('prepareEff call', t => {
  t.deepEqual(
    prepareEff(),
    []
  );
  t.deepEqual(
    prepareEff({CALL: {fn: 'fn', args: [1, 2, 3]}}),
    ['call', ['fn', 1, 2, 3]]
  );
  t.deepEqual(
    prepareEff({CPS: {fn: 'fn', args: ['a', 'b', 'c']}}),
    ['cps', ['fn', 'a', 'b', 'c']]
  );
  t.deepEqual(
    prepareEff({FORK: {fn: 'fn', args: ['a']}}),
    ['fork', ['fn', 'a']]
  );
  t.deepEqual(
    prepareEff({FORK: {fn: 'fn', args: ['a'], detached: true}}),
    ['spawn', ['fn', 'a']]
  );
  t.deepEqual(
    prepareEff({CALL: {fn: 'fn', context: {a: 1}, args: [1]}}),
    ['call', [[{a: 1}, 'fn'], 1]]
  );
});

test('prepareEff take', t => {
  t.deepEqual(
    prepareEff({TAKE: {pattern: 'action'}}),
    ['take', ['action']]
  );
  t.deepEqual(
    prepareEff({TAKE: {pattern: 'action', maybe: true}}),
    ['takem', ['action']]
  );
  t.deepEqual(
    prepareEff({ACTION_CHANNEL: {pattern: 'p', buffer: undefined}}),
    ['actionChannel', ['p']]
  );
});

test('prepareEff put', t => {
  t.deepEqual(
    prepareEff({PUT: {action: {type: 'a'}}}),
    ['put', [{type: 'a'}]]
  );
  t.deepEqual(
    prepareEff({PUT: {action: {type: 'b'}, sync: true}}),
    ['put.sync', [{type: 'b'}]]
  );

  const testPutWithChannel = (effName, opts = {}) => {
    const withChannel = prepareEff({
      PUT: {
        channel: {},
        action: {type: 'd'},
        ...opts
      }
    });
    t.is(withChannel[0], effName);
    t.is(typeof withChannel[1][0] === 'function' &&
         withChannel[1][0].name === '[Channel]', true);
    t.deepEqual(withChannel[1][1], {type: 'd'});
  };
  testPutWithChannel('put');
  testPutWithChannel('put.sync', {sync: true});
});
