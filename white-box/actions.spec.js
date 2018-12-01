const {signedTask, ...actions} = require('./actions');
const {msgTest} = require('./helpers');

const actionTest = (actionFn, action) => test(actionFn, () => {
  expect(actions[actionFn](1)).toEqual({value: 1, action});
  expect(actions[actionFn]()).toEqual({value: undefined, action});
  expect(actions[actionFn](2, 3, 4)).toEqual({value: 2, action});
});

actionTest('gets', 'next');
actionTest('throws', 'throw');

test('signedTask()', () => {
  expect(() => signedTask()).toThrow(msgTest(/have to pass/));
});

test('signedTask(signature)', () => {
  expect(signedTask('ok').__signature__).toBe('ok');
});
