const {gets, throws, testSaga} = require('.');

test('testSaga', () => {
  function* regeneratedTestGen() {
    try {
      const valueFromNext = yield 1;
      yield valueFromNext;
    } catch (err) {
      yield err;
    }
    yield 2;
    yield 3;
  }

  const testVal = '__TEST_PASSED_VALUE__';
  const testErr = '__TEST_ERR__';

  expect(() =>
    testSaga(regeneratedTestGen, [null, undefined, 1, '', {}, [], false])
  ).not.toThrow();

  const check = number => value =>
    expect(value).toEqual({value: number, done: false});

  testSaga(regeneratedTestGen, [
    check(1),
    value => expect(value).toEqual({value: undefined, done: false})
  ]);

  testSaga(regeneratedTestGen, [
    check(1),
    gets(testVal),
    value => expect(value).toEqual({value: testVal, done: false})
  ]);

  expect(() =>
    testSaga(regeneratedTestGen, [
      check(1),
      throws(testErr),
      value => expect(value).toEqual({value: testErr, done: false}),
      check(2),
      check(3)
    ])
  ).not.toThrow();

  let counter = 0;
  function* counterGen() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
  }
  const inc = ({value: x}) => (counter += x);
  testSaga(counterGen, [[inc], [[inc], inc], inc]);
  expect(counter).toBe(10);
});
