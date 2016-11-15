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

const getEffName = (eff = {}) => {
  const name = R.find(key => R.toUpper(key) === key, R.keys(eff));
  if (!name) {
    return;
  }
  return R.toLower(name);
};

const prepareEff = (step = {}) => {
  const name = getEffName(step);
  if (!name) {
    return [];
  }
  const eff = step[R.toUpper(name)];
  switch (name) {
    case 'call':
    case 'cps':
      return [name,
        [eff.context ? [eff.context, eff.fn] : eff.fn, ...eff.args]
      ];

    case 'take':
      return [name, [eff.pattern]];

    default:
      return [name];
  }
};

module.exports = {
  assertionMessage,
  getEffName,
  prepareEff
};
