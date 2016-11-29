const test = require('ava');
const W = require('../../src/white-box');

const {logout, login, authenticated, unauthenticated} = require('./actions');
const auth = require('./saga');

const checksForLocalStorage = [
  // at first, let's check if there is an idToken in the localStorage
  W.calls('localStorage.getItem', 'idToken')
];

const logsOut = [
  // to log out, user has to dispatch a logout action
  W.takes(logout()),

  // here should be firebase auth sign out logic

  // when the user logs out, we should dispatch an action that user
  // was unauthenticated
  W.puts(unauthenticated())
];

const logsIn = [
  // to log in, user has to dispatch a login action
  W.takes(login()),

  // here should be firebase auth sign in logic

  // when the user logs in, we should dispatch an action that user
  // was authenticated
  W.puts(authenticated())
];

test('user has been already authorized', () => {
  const idToken = '__ID_TOKEN__';

  W.testSaga(auth, [
    checksForLocalStorage,
    // for this example, let's assume that we have an idToken in the
    // localStorage
    W.gets(idToken),

    // then we have to dispatch an action, that our user has been already
    // authenticated
    W.puts(authenticated({idToken})),

    // and let's wait for a logout action
    logsOut,

    // and now we can wait for a login action
    logsIn,

    // since user is authorized, we should start to listen for a logout action
    // again
    logsOut
  ]);
});

test('user has not been authorized yet', () => {
  W.testSaga(auth, [
    checksForLocalStorage,

    // since we don't have any idToken in the localStorage
    // we should start to listen for a login action
    logsIn,

    // when user logs in, we should start to listen for log out
    logsOut,

    // and log in after
    logsIn

    // and so on...
  ]);
});
