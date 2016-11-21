const test = require('ava');

const {actionChannel} = require('redux-saga/effects');
const {tester} = require('./takes');
const {next, msgIs} = require('./helpers');
const {generateTests, generateEffTests} = require('./takes.spec');

const createsChannel = tester('createsChannel', 'actionChannel');

generateTests('createsChannel', createsChannel);
generateEffTests('actionChannel', createsChannel);

test('createsChannel(pattern, buffer)', t => {
  t.throws(() => createsChannel('pattern')[0](
    next(actionChannel('pattern', {buffer: 'a'}))), msgIs(
    ['actionChannel', ['pattern']],
    ['actionChannel', ['pattern', {buffer: 'a'}]]
  ));

  createsChannel('x', {y: 1})[0](next(actionChannel('x', {y: 1})));
});
