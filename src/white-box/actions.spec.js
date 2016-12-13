const test = require('ava');
const {signedTask, ...actions} = require('./actions');
const {msgTest} = require('./helpers');

const actionTest = (actionFn, action) => test(actionFn, t => {
  t.deepEqual(actions[actionFn](1), {value: 1, action});
  t.deepEqual(actions[actionFn](), {value: undefined, action});
  t.deepEqual(actions[actionFn](2, 3, 4), {value: 2, action});
});

actionTest('gets', 'next');
actionTest('throws', 'throw');

test('signedTask()', t => {
  t.throws(() => signedTask(), msgTest(/have to pass/));
});

test('signedTask(signature)', t => {
  t.is(signedTask('ok').__signature__, 'ok');
});
