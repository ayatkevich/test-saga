const R = require('ramda');
const {
  assertionMessage,
  retrieveEff,
  prepareEff,
  namedFn
} = require('./message');

function fnName() {}

test('namedFn', () => {
  const fn = namedFn('named');
  expect(R.type(fn)).toBe('Function');
  expect(fn.name).toBe('named');
  expect(() => fn()).not.toThrow();
});

test('assertionMessage', () => {
  const expected = ['call', ['fnName', 1, true, 'string', {}, [], null]];
  const expectedMessage = `Expected:
      yield call("fnName", 1, true, "string", {}, [], null);`;

  expect(
    assertionMessage(expected, [
      'call',
      [fnName, 0, false, () => {}, {a: 1}, [1]]
    ])
  ).toBe(`
    ${expectedMessage}
    Got:
      yield call(fnName, 0, false, [anonymous], {"a":1}, [1]);
  `);

  expect(
    assertionMessage(expected, [
      'call',
      [[{b: 2}, fnName], 0, false, () => {}, {a: 1}, [1]]
    ])
  ).toBe(
    `
    ${expectedMessage}
    Got:
      yield call([{"b":2}, fnName], 0, false, [anonymous], {"a":1}, [1]);
  `
  );

  expect(assertionMessage(expected, [])).toBe(
    `
    ${expectedMessage}
    Got:
      nothing
  `
  );

  expect(assertionMessage(expected, ['call', [() => {}, 0, false]])).toBe(
    `
    ${expectedMessage}
    Got:
      yield call([anonymous], 0, false);
  `
  );
});

test('retrieveEff', () => {
  expect(retrieveEff()).toEqual({name: undefined, eff: {}});
  expect(retrieveEff({})).toEqual({name: undefined, eff: {}});
  expect(retrieveEff({a: 1, b: 2, c: 3})).toEqual({name: undefined, eff: {}});
  expect(retrieveEff({A: 1, b: 2, c: 3})).toEqual({name: 'a', eff: 1});
  expect(retrieveEff({A: 1, B: 2, C: 3})).toEqual({name: 'a', eff: 1});
  expect(retrieveEff({FORK: {a: 1, detached: true}})).toEqual({
    name: 'spawn',
    eff: {a: 1, detached: true}
  });
  expect(retrieveEff({PUT: {a: 1, sync: true}})).toEqual({
    name: 'put.sync',
    eff: {a: 1, sync: true}
  });
});

test('prepareEff', () => {
  expect(prepareEff({UNKNOWN: {x: 1, y: 2}})).toEqual(['unknown']);
});

test('prepareEff call', () => {
  expect(prepareEff()).toEqual([]);
  expect(prepareEff({CALL: {fn: 'fn', args: [1, 2, 3]}})).toEqual([
    'call',
    ['fn', 1, 2, 3]
  ]);
  expect(prepareEff({CPS: {fn: 'fn', args: ['a', 'b', 'c']}})).toEqual([
    'cps',
    ['fn', 'a', 'b', 'c']
  ]);
  expect(prepareEff({FORK: {fn: 'fn', args: ['a']}})).toEqual([
    'fork',
    ['fn', 'a']
  ]);
  expect(prepareEff({FORK: {fn: 'fn', args: ['a'], detached: true}})).toEqual([
    'spawn',
    ['fn', 'a']
  ]);
  expect(prepareEff({CALL: {fn: 'fn', context: {a: 1}, args: [1]}})).toEqual([
    'call',
    [[{a: 1}, 'fn'], 1]
  ]);
});

test('prepareEff take', () => {
  expect(prepareEff({TAKE: {pattern: 'action'}})).toEqual(['take', ['action']]);
  expect(prepareEff({TAKE: {pattern: 'action', maybe: true}})).toEqual([
    'takeMaybe',
    ['action']
  ]);
  expect(
    prepareEff({ACTION_CHANNEL: {pattern: 'p', buffer: undefined}})
  ).toEqual(['actionChannel', ['p']]);
});

test('prepareEff put', () => {
  expect(prepareEff({PUT: {action: {type: 'a'}}})).toEqual([
    'put',
    [{type: 'a'}]
  ]);
  expect(prepareEff({PUT: {action: {type: 'b'}, sync: true}})).toEqual([
    'put.sync',
    [{type: 'b'}]
  ]);

  const testPutWithChannel = (effName, opts = {}) => {
    const withChannel = prepareEff({
      PUT: {
        channel: {},
        action: {type: 'd'},
        ...opts
      }
    });
    expect(withChannel[0]).toBe(effName);
    expect(
      typeof withChannel[1][0] === 'function' &&
        withChannel[1][0].name === '[Channel]'
    ).toBe(true);
    expect(withChannel[1][1]).toEqual({type: 'd'});
  };
  testPutWithChannel('put');
  testPutWithChannel('put.sync', {sync: true});
});
