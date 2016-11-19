const test = require('ava');
const {testSaga, calls, gets, takes} = require('../../src/unit');

const {login} = require('./actions');
const auth = require('./saga');

test('user was already authorized', () => testSaga(auth, [
  calls('localStorage.getItem', 'idToken'),
  gets(undefined),

  takes(login())
]));
