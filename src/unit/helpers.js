const sagaSignature = '@@redux-saga/IO';

const next = (value, done = false) => ({value, done});

const namedFn = value =>
  Object.defineProperty(() => {}, 'name', {value});

module.exports = {
  next,
  sagaSignature,
  namedFn
};
