const test = require('ava');
const {select, join} = require('redux-saga/effects');
const {createMockTask} = require('redux-saga/utils');
const {namedFn} = require('./message');
const {next, msgIs, msgTest} = require('./helpers');

const joins = require('./joins');

test('nothing', t => {
  const gotNothing = msgIs(['join', [namedFn('[Task]')]], []);
  t.throws(() => joins()(), gotNothing);
  t.throws(() => joins()({}), gotNothing);
  t.throws(() => joins()(next({})), gotNothing);
});

test('wrong', t => {
  t.throws(() => joins()(next(select())), msgIs(
    ['join', [namedFn('[Task]')]],
    ['select', []]
  ));
});

test('joins()', () => {
  joins()(next(join(createMockTask())));
});

test('joins(name)', t => {
  t.throws(() => joins('that task')(next(join(createMockTask()))),
    msgTest(/is not/));
});
