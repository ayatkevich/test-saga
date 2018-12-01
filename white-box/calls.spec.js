const {call, apply, take, ...effects} = require('redux-saga/effects');
const {next, msgIs} = require('./helpers');

const calls = require('./calls');

const fn = () => {};
const action = () => {};
const context = {};

test('call(fn, ...args)', () => {
  expect(() => calls()()).toThrow();
  expect(() => calls()(next(call(fn)))).toThrow();

  const gotNothing = msgIs(
    ['call', [fn]],
    []
  );
  expect(() => calls('fn')()).toThrow(gotNothing);
  expect(() => calls('fn')({})).toThrow(gotNothing);
  expect(() => calls('fn')(next({}))).toThrow(gotNothing);

  expect(() => calls('action')(next(take('action')))).toThrow(msgIs(
    ['call', [action]],
    ['take', ['action']]
  ));
  expect(() => calls('fn')(next(call(fn, 1)))).toThrow(msgIs(
    ['call', [fn]],
    ['call', [fn, 1]]
  ));
  expect(() => calls(action)(next(call(fn)))).toThrow(msgIs(
    ['call', [action]],
    ['call', [fn]]
  ));

  calls(fn)(next(call(fn)));
  calls('fn')(next(call(fn)));
  calls('fn', 1)(next(call(fn, 1)));
  calls('fn', 1, {}, {a: 1})(next(call(fn, 1, {}, {a: 1})));
});

test('call([context, fn], ...args)', () => {
  expect(() => calls('fn')(next(call([context, fn])))).toThrow(msgIs(
    ['call', [fn]],
    ['call', [[{}, fn]]]
  ));

  calls(['context', 'fn'])(next(call([context, fn])));
});

test('apply(context, fn, [args])', () => {
  expect(() => calls(fn)(next(apply(context, fn)))).toThrow(msgIs(
    ['call', [fn]],
    ['call', [[{}, fn]]]
  ));
});

const testDrivativeCallEffect = name => {
  const eff = effects[name];

  test(`${name}(fn, ...args)`, () => {
    expect(() => calls(fn)(next(eff(fn, 1)))).toThrow(msgIs(
      [name, [fn]],
      [name, [fn, 1]]
    ));

    calls(fn)(next(eff(fn)));
  });

  test(`${name}([context, fn], ...args)`, () => {
    expect(() => calls('fn')(next(eff([context, fn])))).toThrow(msgIs(
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
