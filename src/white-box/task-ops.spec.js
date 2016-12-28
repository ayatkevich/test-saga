const test = require('ava');
const {select, ...effs} = require('redux-saga/effects');
const {createMockTask} = require('redux-saga/utils');
const {namedFn} = require('./message');
const {next, msgIs, msgTest} = require('./helpers');
const {signedTask} = require('./actions');

const ops = require('./task-ops');

const testOp = (eff, op) => {
  test(`${op} nothing`, t => {
    const gotNothing = msgIs([eff, [namedFn('[Task]')]], []);
    t.throws(() => ops[op]()(), gotNothing);
    t.throws(() => ops[op]()({}), gotNothing);
    t.throws(() => ops[op]()(next({})), gotNothing);
  });

  test(`${op} wrong`, t => {
    t.throws(() => ops[op]()(next(select())), msgIs(
      [eff, [namedFn('[Task]')]],
      ['select', []]
    ));
  });

  test(`${op}()`, () => {
    ops[op]()(next(effs[eff](createMockTask())));
  });

  test(`${op}(name)`, t => {
    t.throws(() => ops[op]('that task')(next(effs[eff](createMockTask()))),
      msgTest(/is not/));

    ops[op]('this task')(next(effs[eff](signedTask('this task'))));
  });
};

testOp('join', 'joins');
testOp('cancel', 'cancels');
