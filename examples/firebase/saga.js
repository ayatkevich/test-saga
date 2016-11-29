const {get} = require('lockr');
const {call, take, put} = require('redux-saga/effects');
const actions = require('./actions');

function * logout() {
  yield take(actions.logout.type);

  yield put(actions.unauthenticated());

  yield * login();
}

function * login() {
  yield take(actions.login.type);

  yield put(actions.authenticated());

  yield * logout();
}

function * auth() {
  const idToken = yield call(get, 'idToken');

  if (idToken) {
    yield put(actions.authenticated({idToken}));

    yield * logout();
  } else {
    yield * login();
  }
}

module.exports = auth;
