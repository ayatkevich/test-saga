const test = require('ava');
const R = require('ramda');
const effects = require('redux-saga/effects');
const action = require('action-helper');
const {next, msgIs, msgTest} = require('./helpers');

const takes = require('./takes');

const {call} = effects;

const login = action('LOGIN');

const generateTests = (testerName, tester) => {
  test(`${testerName}(string)`, t => {
    const [testerFn, gets] = tester('action');
    t.is(R.type(testerFn), 'Function');
    t.deepEqual(gets, {value: {type: 'action'}, action: 'next'});
  });

  test(`${testerName}(object)`, t => {
    const [testerFn, gets] = tester({type: 'action', a: 1});
    t.is(R.type(testerFn), 'Function');
    t.deepEqual(gets, {value: {type: 'action', a: 1}, action: 'next'});
  });

  test(`${testerName}(array)`, t => {
    const [testerFn, gets] = tester(['x', 'y']);
    t.is(R.type(testerFn), 'Function');
    t.is(gets, undefined);
  });
};

const generateEffTests = (effName, tester) => {
  test(`${effName}(string)`, t => {
    t.throws(() => tester({})[0](next(effects[effName]('*'))),
      msgTest(/type property/));

    const takeAll = [
      effName === 'actionChannel' ? 'actionChannel' : 'take',
      ['*']
    ];

    const gotNothing = msgIs(takeAll, []);
    t.throws(() => tester()[0](), gotNothing);
    t.throws(() => tester()[0]({}), gotNothing);
    t.throws(() => tester()[0](next({})), gotNothing);

    t.throws(() => tester()[0](next(call(tester))), msgIs(
      takeAll,
      ['call', [tester]]
    ));
    t.throws(() => tester()[0](next(effects[effName]('x'))), msgIs(
      [effName, ['*']],
      [effName, ['x']]
    ));
    t.throws(() => tester('x')[0](next(effects[effName]('y'))), msgIs(
      [effName, ['x']],
      [effName, ['y']]
    ));

    tester()[0](next(effects[effName]('*')));
    tester('pattern')[0](next(effects[effName]('pattern')));
    tester({type: 'x'})[0](next(effects[effName]('x')));
    tester(login)[0](next(effects[effName](login.type)));
  });

  test(`${effName}(function)`, t => {
    const sampleActionMsg = msgTest(/have to pass a sample action/);
    t.throws(() => tester()[0](next(effects[effName](R.prop('x')))),
      sampleActionMsg);
    t.throws(
      () => tester('string pattern')[0](next(effects[effName](R.prop('x')))),
      sampleActionMsg
    );

    t.throws(() => tester(login)[0](next(effects[effName](R.prop('username')))),
      msgTest(/does not match (.*?). It returns: "undefined"/));

    t.throws(() => tester(login)[0](next(effects[effName](it => it.a.b))),
      msgTest(/error "(.*?)" was occured/));

    tester(login({rememberMe: true}))[0](
      next(effects[effName](R.prop('rememberMe'))));
  });

  test(`${effName}(array)`, t => {
    t.throws(() => tester(login)[0](next(effects[effName]([]))),
      msgTest(/does not contain/));
    t.throws(() => tester(login)[0](next(effects[effName](['x']))),
      msgTest(/does not contain/));

    t.throws(() => tester([])[0](next(effects[effName](['x']))), msgIs(
      [effName, [[]]],
      [effName, [['x']]]
    ));

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
generateEffTests('takem', takes);
