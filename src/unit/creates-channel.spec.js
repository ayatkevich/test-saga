const test = require('ava');

const {actionChannel} = require('redux-saga/effects');
const {next, msgIs} = require('./helpers');
const {generateEffTests} = require('./takes.spec');

const createsChannel = require('./creates-channel');

test('createsChannel', t => {
  t.deepEqual(createsChannel([1, 2])[1], {value: [1, 2], action: 'next'});
});

generateEffTests('actionChannel', createsChannel);

test('actionChannel(pattern, buffer)', t => {
  t.throws(() => createsChannel('pattern')[0](
    next(actionChannel('pattern', {buffer: 'a'}))), msgIs(
    ['actionChannel', ['pattern']],
    ['actionChannel', ['pattern', {buffer: 'a'}]]
  ));

  createsChannel('x', {y: 1})[0](next(actionChannel('x', {y: 1})));
});
