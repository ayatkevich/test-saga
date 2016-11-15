const test = require('ava');
const {gets, throws, testSaga} = require('.');

test('gets', t => {
  t.deepEqual(gets(1), {value: 1, action: 'next'});
  t.deepEqual(gets(), {value: undefined, action: 'next'});
  t.deepEqual(gets(2, 3, 4), {value: 2, action: 'next'});
});

test('throws', t => {
  t.deepEqual(throws(1), {value: 1, action: 'throw'});
  t.deepEqual(throws(), {value: undefined, action: 'throw'});
  t.deepEqual(throws(2, 3, 4), {value: 2, action: 'throw'});
});

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
});
