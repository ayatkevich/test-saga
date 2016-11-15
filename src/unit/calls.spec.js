const test = require('ava');
const {call, take} = require('redux-saga/effects');
const {next} = require('./helpers');

const calls = require('./calls');

test('calls call', t => {
  const fn = () => {};
  const anotherFn = () => {};

  t.throws(() => calls()());
  t.throws(() => calls('fn')());
  t.throws(() => calls('fn')({}));
  t.throws(() => calls('fn')(next({})));
  t.throws(() => calls()(next(call(fn))));
  t.throws(() => calls('action')(next(take('action'))));
  t.throws(() => calls('fn')(next(call(fn, 1))));
  t.throws(() => calls(anotherFn)(next(call(fn))));

  calls('fn')(next(call(fn)));
  calls('fn', 1)(next(call(fn, 1)));
  calls('fn', 1, {}, {a: 1})(next(call(fn, 1, {}, {a: 1})));
});
