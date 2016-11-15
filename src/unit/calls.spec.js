const test = require('ava');
const R = require('ramda');
const {call, apply, cps, take} = require('redux-saga/effects');
const {assertionMessage} = require('./message');
const {next} = require('./helpers');

const calls = require('./calls');

const msgIs = (...args) => R.pipe(
  R.prop('message'),
  R.equals(assertionMessage(...args))
);

const fn = () => {};
const action = () => {};
const context = {};

test('call(fn, ...args)', t => {
  t.throws(() => calls()());
  t.throws(() => calls()(next(call(fn))));

  const gotNothing = msgIs(
    ['call', [fn]],
    []
  );
  t.throws(() => calls('fn')(), gotNothing);
  t.throws(() => calls('fn')({}), gotNothing);
  t.throws(() => calls('fn')(next({})), gotNothing);

  t.throws(() => calls('action')(next(take('action'))), msgIs(
    ['call', [action]],
    ['take', ['action']]
  ));
  t.throws(() => calls('fn')(next(call(fn, 1))), msgIs(
    ['call', [fn]],
    ['call', [fn, 1]]
  ));
  t.throws(() => calls(action)(next(call(fn))), msgIs(
    ['call', [action]],
    ['call', [fn]]
  ));

  calls(fn)(next(call(fn)));
  calls('fn')(next(call(fn)));
  calls('fn', 1)(next(call(fn, 1)));
  calls('fn', 1, {}, {a: 1})(next(call(fn, 1, {}, {a: 1})));
});

test('call([context, fn], ...args)', t => {
  t.throws(() => calls('fn')(next(call([context, fn]))), msgIs(
    ['call', [fn]],
    ['call', [[{}, fn]]]
  ));

  calls(['context', 'fn'])(next(call([context, fn])));
});

test('apply(context, fn, [args])', t => {
  t.throws(() => calls(fn)(next(apply(context, fn))), msgIs(
    ['call', [fn]],
    ['call', [[{}, fn]]]
  ));
});

test('cps(fn, ...args)', t => {
  t.throws(() => calls(fn)(next(cps(fn, 1))), msgIs(
    ['cps', [fn]],
    ['cps', [fn, 1]]
  ));

  calls(fn)(next(cps(fn)));
});

test('cps([context, fn], ...args)', t => {
  t.throws(() => calls('fn')(next(cps([context, fn]))), msgIs(
    ['cps', [fn]],
    ['cps', [[{}, fn]]]
  ));

  calls([{}, fn])(next(cps([context, fn])));
  calls([context, fn])(next(cps([context, fn])));
  calls(['context', 'fn'])(next(cps([context, fn])));
});
