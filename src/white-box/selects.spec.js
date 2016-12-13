const test = require('ava');
const {select} = require('redux-saga/effects');
const {next, msgIs, msgTest} = require('./helpers');

const selects = require('./selects');

test('empty', t => {
  t.throws(() => selects({}).from()[0](), msgTest(/empty/));
  t.throws(() => selects().from({})[0](), msgTest(/empty/));
  t.throws(() => selects().from()[0](), msgTest(/empty/));
});

test('got nothing', t => {
  const gotNothing = msgIs(['select', []], []);
  t.throws(() => selects({}).from({})[0](), gotNothing);
  t.throws(() => selects({}).from({})[0]({}), gotNothing);
  t.throws(() => selects({}).from({})[0](next({})), gotNothing);
});

test('selects(X).from(X)', t => {
  const X = {a: 1};
  const [$selects, $got] = selects(X).from(X);
  $selects(next(select()));
  t.deepEqual($got, {value: X, action: 'next'});
});

test('selects(y).from(Y)', t => {
  const Y = {y: {a: 1}};
  const [$selects, $got] = selects(Y.y).from(Y);
  $selects(next(select(it => it.y)));
  t.deepEqual($got, {value: Y.y, action: 'next'});
});

test('does not equal', t => {
  const [$selects] = selects({x: 1}).from({y: 2});
  t.throws(() => $selects(next(select())), msgTest(/does not/));
});
