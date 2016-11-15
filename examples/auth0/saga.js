const {get} = require('lockr');
const {call} = require('redux-saga/effects');

function * auth() {
  yield call(get, 'idToken');
}

module.exports = auth;
