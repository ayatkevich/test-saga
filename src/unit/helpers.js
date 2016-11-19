const R = require('ramda');
const {assertionMessage} = require('./message');

const sagaSignature = '@@redux-saga/IO';

const next = (value, done = false) => ({value, done});

const namedFn = value =>
  Object.defineProperty(() => {}, 'name', {value});

const msgIs = (...args) => R.pipe(
  R.prop('message'),
  R.equals(assertionMessage(...args))
);

module.exports = {
  next,
  sagaSignature,
  namedFn,
  msgIs
};
