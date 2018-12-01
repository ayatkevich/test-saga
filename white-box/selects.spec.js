const {select, take} = require('redux-saga/effects');
const {next, msgIs, msgTest} = require('./helpers');

const selects = require('./selects');

test('empty', () => {
  expect(() => selects({}).from()[0]()).toThrow(msgTest(/empty/));
  expect(() => selects().from({})[0]()).toThrow(msgTest(/empty/));
  expect(() => selects().from()[0]()).toThrow(msgTest(/empty/));
});

test('got nothing', () => {
  const gotNothing = msgIs(['select', []], []);
  expect(() => selects({}).from({})[0]()).toThrow(gotNothing);
  expect(() => selects({}).from({})[0]({})).toThrow(gotNothing);
  expect(() => selects({}).from({})[0](next({}))).toThrow(gotNothing);
});

test('wrong', () => {
  expect(() => selects({}).from({})[0](next(take()))).toThrow(
    msgIs(['select', []], ['take', ['*']])
  );
});

test('selects(X).from(X)', () => {
  const X = {a: 1};
  const [$selects, $got] = selects(X).from(X);
  $selects(next(select()));
  expect($got).toEqual({value: X, action: 'next'});
});

test('selects(y).from(Y)', () => {
  const Y = {y: {a: 1}};
  const [$selects, $got] = selects(Y.y).from(Y);
  $selects(next(select(it => it.y)));
  expect($got).toEqual({value: Y.y, action: 'next'});
});

test('does not equal', () => {
  const [$selects] = selects({x: 1}).from({y: 2});
  expect(() => $selects(next(select()))).toThrow(msgTest(/does not/));
});
