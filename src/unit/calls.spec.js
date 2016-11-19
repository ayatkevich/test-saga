const test = require('ava');
const {call, apply, take, ...effects} = require('redux-saga/effects');
const {next, msgIs} = require('./helpers');

const calls = require('./calls');

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

const testDrivativeCallEffect = name => {
  const eff = effects[name];

  test(`${name}(fn, ...args)`, t => {
    t.throws(() => calls(fn)(next(eff(fn, 1))), msgIs(
      [name, [fn]],
      [name, [fn, 1]]
    ));

    calls(fn)(next(eff(fn)));
  });

  test(`${name}([context, fn], ...args)`, t => {
    t.throws(() => calls('fn')(next(eff([context, fn]))), msgIs(
      [name, [fn]],
      [name, [[{}, fn]]]
    ));

    calls([{}, fn])(next(eff([context, fn])));
    calls([context, fn])(next(eff([context, fn])));
    calls(['context', 'fn'])(next(eff([context, fn])));
  });
};

testDrivativeCallEffect('cps');
testDrivativeCallEffect('fork');
testDrivativeCallEffect('spawn');
