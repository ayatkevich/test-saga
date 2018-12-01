const {gets, throws, testSaga} = require('.');

test('testSaga', () => {
  function * regeneratedTestGen() {
    try {
      const valueFromNext = yield 1;
      yield valueFromNext;
    } catch (err) {
      yield err;
    }
  }

  const testVal = '__TEST_PASSED_VALUE__';
  const testErr = '__TEST_ERR__';

  expect(() =>
    testSaga(regeneratedTestGen, [null, undefined, 1, '', {}, [], false])
  ).not.toThrow();

  const checkFirst = value => expect(value).toEqual({value: 1, done: false});

  testSaga(regeneratedTestGen, [
    checkFirst,
    value => expect(value).toEqual({value: undefined, done: false})
  ]);

  testSaga(regeneratedTestGen, [
    checkFirst,
    gets(testVal),
    value => expect(value).toEqual({value: testVal, done: false})
  ]);

  testSaga(regeneratedTestGen, [
    checkFirst,
    throws(testErr),
    value => expect(value).toEqual({value: testErr, done: false})
  ]);

  let counter = 0;
  function * counterGen() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
  }
  /* eslint-disable no-return-assign */
  const inc = ({value: x}) => counter += x;
  testSaga(counterGen, [[inc], [[inc], inc], inc]);
  expect(counter).toBe(10);
});
