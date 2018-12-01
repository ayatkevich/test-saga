const {next} = require('./helpers');

test('next', () => {
  expect(next()).toEqual({value: undefined, done: false});
  expect(next(1)).toEqual({value: 1, done: false});
  expect(next(2, true)).toEqual({value: 2, done: true});
});
