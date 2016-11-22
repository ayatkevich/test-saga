const test = require('ava');
const R = require('ramda');
const {assertionMessage} = require('./message');
const {next, namedFn, msgIs, msgTest} = require('./helpers');

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

test('msgIs', t => {
  const args = [['eff', []], []];
  t.is(msgIs(...args)({message: assertionMessage(...args)}), true);
});

test('msgTest', t => {
  t.is(msgTest(/ok/)({message: 'Fukuoka'}), true);
});
