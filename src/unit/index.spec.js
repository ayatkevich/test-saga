const test = require('ava');
const {gets, throws, testSaga} = require('.');

test('testSaga', t => {
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

  t.notThrows(() =>
    testSaga(regeneratedTestGen, [null, undefined, 1, '', {}, [], false])
  );

  const checkFirst = value => t.deepEqual(value, {value: 1, done: false});

  testSaga(regeneratedTestGen, [
    checkFirst,
    value => t.deepEqual(value, {value: undefined, done: false})
  ]);

  testSaga(regeneratedTestGen, [
    checkFirst,
    gets(testVal),
    value => t.deepEqual(value, {value: testVal, done: false})
  ]);

  testSaga(regeneratedTestGen, [
    checkFirst,
    throws(testErr),
    value => t.deepEqual(value, {value: testErr, done: false})
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
  t.is(counter, 10);
});
