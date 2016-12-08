const R = require('ramda');
const {assertionMessage} = require('./message');

const sagaSignature = '@@redux-saga/IO';

const next = (value, done = false) => ({value, done});

const msg = R.prop('message');

const msgIs = (...args) => R.pipe(msg, R.equals(assertionMessage(...args)));

const msgTest = regexp => R.pipe(msg, R.test(regexp));

module.exports = {
  next,
  sagaSignature,
  msgIs,
  msgTest
};
