const {select, cancelled, ...effs} = require('redux-saga/effects');
const {createMockTask} = require('redux-saga/utils');
const {namedFn} = require('./message');
const {next, msgIs, msgTest} = require('./helpers');
const {signedTask} = require('./actions');

const ops = require('./task-ops');

const testOp = (eff, op) => {
  test(`${op} nothing`, () => {
    const gotNothing = msgIs([eff, [namedFn('[Task]')]], []);
    expect(() => ops[op]()()).toThrow(gotNothing);
    expect(() => ops[op]()({})).toThrow(gotNothing);
    expect(() => ops[op]()(next({}))).toThrow(gotNothing);
  });

  test(`${op} wrong`, () => {
    expect(() => ops[op]()(next(select()))).toThrow(
      msgIs([eff, [namedFn('[Task]')]], ['select', []])
    );
  });

  test(`${op}()`, () => {
    ops[op]()(next(effs[eff](createMockTask())));
  });

  test(`${op}(name)`, () => {
    expect(() =>
      ops[op]('that task')(next(effs[eff](createMockTask())))
    ).toThrow(msgTest(/is not/));

    ops[op]('this task')(next(effs[eff](signedTask('this task'))));
  });
};

testOp('join', 'joins');
testOp('cancel', 'cancels');

describe('isCancelled', () => {
  const [isCancelled] = ops.isCancelled();

  test('nothing', () => {
    const gotNothing = msgIs(['cancelled', []], []);
    expect(() => isCancelled()).toThrow(gotNothing);
    expect(() => isCancelled({})).toThrow(gotNothing);
    expect(() => isCancelled(next({}))).toThrow(gotNothing);
  });

  test('wrong', () => {
    expect(() => isCancelled(next(select()))).toThrow(
      msgIs(['cancelled', []], ['select', []])
    );
  });

  test('correct', () => {
    expect(() => isCancelled(next(cancelled()))).not.toThrow();
  });
});
