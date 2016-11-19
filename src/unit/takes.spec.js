const test = require('ava');
const R = require('ramda');
const {call, ...effects} = require('redux-saga/effects');
const action = require('action-helper');
const {next, msgIs} = require('./helpers');

const takes = require('./takes');

const login = action('LOGIN');

test('takes(string)', t => {
  const [takesTest, gets] = takes('action');
  t.is(R.type(takesTest), 'Function');
  t.deepEqual(gets, {value: {type: 'action'}, action: 'next'});
});

test('takes(object)', t => {
  const [takesTest, gets] = takes({type: 'action', a: 1});
  t.is(R.type(takesTest), 'Function');
  t.deepEqual(gets, {value: {type: 'action', a: 1}, action: 'next'});
});

test('takes(array)', t => {
  const [takesTest, gets] = takes(['x', 'y']);
  t.is(R.type(takesTest), 'Function');
  t.is(gets, undefined);
});

const generateTests = effName => {
  test(`${effName}(string)`, t => {
    t.throws(() => takes({})[0](next(effects[effName]())),
      R.test(/type property/));

    const takeAll = ['take', ['*']];

    const gotNothing = msgIs(takeAll, []);
    t.throws(() => takes()[0](), gotNothing);
    t.throws(() => takes()[0]({}), gotNothing);
    t.throws(() => takes()[0](next({})), gotNothing);

    t.throws(() => takes()[0](next(call(takes))), msgIs(
      takeAll,
      ['call', [takes]]
    ));
    t.throws(() => takes()[0](next(effects[effName]('x'))), msgIs(
      [effName, ['*']],
      [effName, ['x']]
    ));
    t.throws(() => takes('x')[0](next(effects[effName]('y'))), msgIs(
      [effName, ['x']],
      [effName, ['y']]
    ));

    takes()[0](next(effects[effName]()));
    takes('pattern')[0](next(effects[effName]('pattern')));
    takes({type: 'x'})[0](next(effects[effName]('x')));
    takes(login)[0](next(effects[effName](login.type)));
  });

  test(`${effName}(function)`, t => {
    const sampleActionMsg = R.test(/have to pass a sample action/);
    t.throws(() => takes()[0](next(effects[effName](R.prop('x')))),
      sampleActionMsg);
    t.throws(
      () => takes('string pattern')[0](next(effects[effName](R.prop('x')))),
      sampleActionMsg
    );

    t.throws(() => takes(login)[0](next(effects[effName](R.prop('username')))),
      R.test(/does not match (.*?). It returns: "undefined"/));

    t.throws(() => takes(login)[0](next(effects[effName](it => it.a.b))),
      R.test(/error "(.*?)" was occured/));

    takes(login({rememberMe: true}))[0](
      next(effects[effName](R.prop('rememberMe'))));
  });

  test(`${effName}(array)`, t => {
    t.throws(() => takes(login)[0](next(effects[effName]([]))),
      R.test(/does not contain/));
    t.throws(() => takes(login)[0](next(effects[effName](['x']))),
      R.test(/does not contain/));

    t.throws(() => takes([])[0](next(effects[effName](['x']))), msgIs(
      [effName, [[]]],
      [effName, [['x']]]
    ));

    takes(login)[0](next(effects[effName]([login.type, 'action'])));
    takes(['x', 'y'])[0](next(effects[effName](['x', 'y'])));
  });
};

generateTests('take');
generateTests('takem');
