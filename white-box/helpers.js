const {assertionMessage} = require('./message');

const sagaSignature = '@@redux-saga/IO';

const next = (value, done = false) => ({value, done});

const msgIs = (...args) => assertionMessage(...args).trim();

const msgTest = regexp => regexp;

module.exports = {
  next,
  sagaSignature,
  msgIs,
  msgTest
};
