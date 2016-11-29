const R = require('ramda');

const inspectArgs = args => R.pipe(R.map(v => {
  if (R.is(Array, v)) {
    return `[${inspectArgs(v)}]`;
  }
  if (R.is(Function, v)) {
    return v.name || v.toString();
  }
  return JSON.stringify(v);
}), R.join(', '))(args);

const assertionMessage = ([expectedEff, expectedArgs],
                          [resultEff, resultArgs = []]) => `
    Expected:
      yield ${expectedEff}(${inspectArgs(expectedArgs)});
    Got:
      ${resultEff ?
        `yield ${resultEff}(${inspectArgs(resultArgs)});` :
        'nothing'}
  `;

const camelize = R.pipe(
  R.toLower,
  R.replace(/_[a-z]/g, R.pipe(R.replace('_', ''), R.toUpper))
);

const retrieveEff = (step = {}) => {
  let name = R.find(key => R.toUpper(key) === key, R.keys(step));
  if (!name) {
    return {name: undefined, eff: {}};
  }
  const eff = step[name];
  if (name === 'FORK' && eff.detached) {
    name = 'SPAWN';
  } else if (name === 'PUT' && eff.sync) {
    name = 'PUT.SYNC';
  }
  return {name: camelize(name), eff};
};

const filterTruthy = R.filter(R.identity);

const prepareEff = (step = {}) => {
  const {name, eff} = retrieveEff(step);
  if (!name) {
    return [];
  }
  switch (name) {
    case 'call':
    case 'cps':
    case 'fork':
    case 'spawn':
      return [name,
        [eff.context ? [eff.context, eff.fn] : eff.fn, ...eff.args]
      ];

    case 'take':
      return [eff.maybe ? 'takem' : name, [eff.pattern]];

    case 'actionChannel':
      return [name, filterTruthy([eff.pattern, eff.buffer])];

    case 'put':
    case 'put.sync':
      return [name, filterTruthy([eff.channel && '[Channel]', eff.action])];

    default:
      return [name];
  }
};

module.exports = {
  assertionMessage,
  retrieveEff,
  prepareEff
};
