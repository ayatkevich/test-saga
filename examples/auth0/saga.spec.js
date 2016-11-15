const test = require('ava');
const {testSaga, calls} = require('../../src/unit');

const auth = require('./saga');

test('user was already authorized', () => testSaga(auth, [
  calls('localStorage.getItem', 'idToken')
]));
