const R = require('ramda');
const effects = require('redux-saga/effects');
const action = require('action-helper');
const {next, msgIs, msgTest} = require('./helpers');

const takes = require('./takes');

const {call} = effects;

const login = action('LOGIN');

const generateTests = (testerName, tester) => {
  test(`${testerName}(string)`, () => {
    const [testerFn, gets] = tester('action');
    expect(R.type(testerFn)).toBe('Function');
    expect(gets).toEqual({value: {type: 'action'}, action: 'next'});
  });

  test(`${testerName}(object)`, () => {
    const [testerFn, gets] = tester({type: 'action', a: 1});
    expect(R.type(testerFn)).toBe('Function');
    expect(gets).toEqual({value: {type: 'action', a: 1}, action: 'next'});
  });

  test(`${testerName}(array)`, () => {
    const [testerFn, gets] = tester(['x', 'y']);
    expect(R.type(testerFn)).toBe('Function');
    expect(gets).toBe(undefined);
  });
};

const generateEffTests = (effName, tester) => {
  test(`${effName}(string)`, () => {
    expect(() => tester({})[0](next(effects[effName]('*')))).toThrow(
      msgTest(/type property/)
    );

    const takeAll = [
      effName === 'actionChannel' ? 'actionChannel' : 'take',
      ['*']
    ];

    const gotNothing = msgIs(takeAll, []);
    expect(() => tester()[0]()).toThrow(gotNothing);
    expect(() => tester()[0]({})).toThrow(gotNothing);
    expect(() => tester()[0](next({}))).toThrow(gotNothing);

    expect(() => tester()[0](next(call(tester)))).toThrow(
      msgIs(takeAll, ['call', [tester]])
    );
    expect(() => tester()[0](next(effects[effName]('x')))).toThrow(
      msgIs([effName, ['*']], [effName, ['x']])
    );
    expect(() => tester('x')[0](next(effects[effName]('y')))).toThrow(
      msgIs([effName, ['x']], [effName, ['y']])
    );

    tester()[0](next(effects[effName]('*')));
    tester('pattern')[0](next(effects[effName]('pattern')));
    tester({type: 'x'})[0](next(effects[effName]('x')));
    tester(login)[0](next(effects[effName](login.type)));
  });

  test(`${effName}(function)`, () => {
    const sampleActionMsg = msgTest(/have to pass a sample action/);
    expect(() => tester()[0](next(effects[effName](R.prop('x'))))).toThrow(
      sampleActionMsg
    );
    expect(() =>
      tester('string pattern')[0](next(effects[effName](R.prop('x'))))
    ).toThrow(sampleActionMsg);

    expect(() =>
      tester(login)[0](next(effects[effName](R.prop('username'))))
    ).toThrow(msgTest(/does not match (.*?). It returns: "undefined"/));

    expect(() =>
      tester(login)[0](next(effects[effName](it => it.a.b)))
    ).toThrow(msgTest(/error "(.*?)" was occured/));

    tester(login({rememberMe: true}))[0](
      next(effects[effName](R.prop('rememberMe')))
    );
  });

  test(`${effName}(array)`, () => {
    expect(() => tester(login)[0](next(effects[effName]([])))).toThrow(
      msgTest(/does not contain/)
    );
    expect(() => tester(login)[0](next(effects[effName](['x'])))).toThrow(
      msgTest(/does not contain/)
    );

    expect(() => tester([])[0](next(effects[effName](['x'])))).toThrow(
      msgIs([effName, [[]]], [effName, [['x']]])
    );

    tester(login)[0](next(effects[effName]([login.type, 'action'])));
    tester(['x', 'y'])[0](next(effects[effName](['x', 'y'])));
  });
};

module.exports = {
  generateTests,
  generateEffTests
};

generateTests('takes', takes);
generateEffTests('take', takes);
generateEffTests('takeMaybe', takes);
