const {actionChannel} = require('redux-saga/effects');
const {buffers} = require('redux-saga');
const {next, msgIs} = require('./helpers');
const {generateEffTests} = require('./takes.spec');

const createsChannel = require('./creates-channel');

test('createsChannel', () => {
  expect(createsChannel([1, 2])[1]).toEqual({value: [1, 2], action: 'next'});
});

generateEffTests('actionChannel', createsChannel);

test('actionChannel(pattern, buffer)', () => {
  expect(() =>
    createsChannel('pattern')[0](next(actionChannel('pattern', buffers.none())))
  ).toThrow(
    msgIs(
      ['actionChannel', ['pattern']],
      ['actionChannel', ['pattern', buffers.none()]]
    )
  );

  createsChannel('x', buffers.none())[0](
    next(actionChannel('x', buffers.none()))
  );
});
