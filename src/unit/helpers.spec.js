const test = require('ava');
const R = require('ramda');
const {next, namedFn} = require('./helpers');

test('next', t => {
  t.deepEqual(next(), {value: undefined, done: false});
  t.deepEqual(next(1), {value: 1, done: false});
  t.deepEqual(next(2, true), {value: 2, done: true});
});

test('namedFn', t => {
  const fn = namedFn('named');
  t.is(R.type(fn), 'Function');
  t.is(fn.name, 'named');
  t.notThrows(() => fn());
});
