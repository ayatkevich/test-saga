const {get} = require('lockr');
const {call, take} = require('redux-saga/effects');
const {login} = require('./actions');

function * auth() {
  yield call(get, 'idToken');
  yield take(login.type);
}

module.exports = auth;
