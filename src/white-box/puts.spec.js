const test = require('ava');
const R = require('ramda');
const action = require('action-helper');
const {put, take} = require('redux-saga/effects');
const {channel} = require('redux-saga');
const {next, msgIs, msgTest} = require('./helpers');
const {namedFn} = require('./message');

const puts = require('./puts');

test('puts()', t => {
  t.throws(() => puts()(), msgTest(/requires/));
});

test('puts(function)', t => {
  const counter = action('COUNTER', 'count');
  const checkCount = R.propEq('count', 10);
  const step = count => next(put(counter({count})));

  t.throws(() => puts(checkCount)(step(1)), msgTest(/does not meet/));

  puts(checkCount)(step(10));
});

test('puts(action)', t => {
  const gotNothing = msgIs(['put', [{}]], []);
  t.throws(() => puts({})(), gotNothing);
  t.throws(() => puts({})({}), gotNothing);
  t.throws(() => puts({})(next({})), gotNothing);

  t.throws(() => puts({})(next(take())), msgIs(
    ['put', [{}]],
    ['take', ['*']]
  ));

  const assertActions = (effCreator, effName) => {
    t.throws(() => puts({a: 1})(next(effCreator({a: 2}))), msgIs(
      [effName, [{a: 1}]],
      [effName, [{a: 2}]]
    ));
    puts({a: 1})(next(effCreator({a: 1})));
  };

  assertActions(put, 'put');
  assertActions(put.sync, 'put.sync');

  t.throws(() => puts({a: 1})(next(put(channel(), {a: 2}))), msgIs(
    ['put', [namedFn('[Channel]'), {a: 1}]],
    ['put', [namedFn('[Channel]'), {a: 2}]]
  ));

  puts({a: 1})(next(put(channel(), {a: 1})));
});
