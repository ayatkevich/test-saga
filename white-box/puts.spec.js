const R = require('ramda');
const action = require('action-helper');
const {put, take} = require('redux-saga/effects');
const {channel} = require('redux-saga');
const {next, msgIs, msgTest} = require('./helpers');
const {namedFn} = require('./message');

const puts = require('./puts');

test('puts()', () => {
  expect(() => puts()()).toThrow(msgTest(/requires/));
});

test('puts(function)', () => {
  const counter = action('COUNTER', 'count');
  const checkCount = R.propEq('count', 10);
  const step = count => next(put(counter({count})));

  expect(() => puts(checkCount)(step(1))).toThrow(msgTest(/does not meet/));

  puts(checkCount)(step(10));
});

test('puts(action)', () => {
  const gotNothing = msgIs(['put', [{}]], []);
  expect(() => puts({})()).toThrow(gotNothing);
  expect(() => puts({})({})).toThrow(gotNothing);
  expect(() => puts({})(next({}))).toThrow(gotNothing);

  expect(() => puts({})(next(take()))).toThrow(
    msgIs(['put', [{}]], ['take', ['*']])
  );

  const assertActions = (effCreator, effName) => {
    expect(() => puts({a: 1})(next(effCreator({a: 2})))).toThrow(
      msgIs([effName, [{a: 1}]], [effName, [{a: 2}]])
    );
    puts({a: 1})(next(effCreator({a: 1})));
  };

  assertActions(put, 'put');
  if (put.sync) {
    // this one is no longer exist in redux-saga
    assertActions(put.sync, 'put.sync');
  }
  if (put.resolve) {
    // this one is no longer exist in redux-saga
    assertActions(put.resolve, 'put.resolve');
  }

  expect(() => puts({a: 1})(next(put(channel(), {a: 2})))).toThrow(
    msgIs(
      ['put', [namedFn('[Channel]'), {a: 1}]],
      ['put', [namedFn('[Channel]'), {a: 2}]]
    )
  );

  puts({a: 1})(next(put(channel(), {a: 1})));
});
