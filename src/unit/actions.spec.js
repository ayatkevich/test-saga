const test = require('ava');
const {gets, throws} = require('./actions');

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
