const test = require('ava');
const {
  testSaga,
  calls,
  takes,
  createsChannel,
  gets
} = require('../../src/white-box');

const actions = require('./actions');
const shoppingCart = require('./saga');

const initializes = [
  // since our saga works with two blocking actions
  // it could be possible when user clicks on submit button and the add item
  // action still blocks the execution cycle
  // hopefully we can fix it with action channels
  createsChannel([actions.submit.type, actions.addItem.type])
];

test('on submit get the list of items and submit', () => {
  const items = [{name: 'apple'}, {name: 'orange'}];

  const waitsForSubmit = [
    // let's wait for an event from user to submit this cart
    takes(actions.submit),
    // at first we need to retrieve a list of items from the local storage
    calls('lockr.get', 'items')
  ];

  testSaga(shoppingCart, [
    initializes,
    waitsForSubmit,
    // let's assume it's not empty
    gets(items),
    // and finally call an api method to submit these items
    calls('api.shoppingCartSubmit', items)
  ]);

  const testFalsyValue = value => testSaga(shoppingCart, [
    initializes,
    waitsForSubmit,
    // if there is a falsy value or an empty list
    gets(value),
    // it should not make an api call
    waitsForSubmit
  ]);

  testFalsyValue(null);
  testFalsyValue([]);
});

test('get the list of items and make user able to update it', () => {
  const item = {name: 'banana'};

  const waitsForAddItem = [
    // let's wait for an update action
    takes(actions.addItem)
  ];

  testSaga(shoppingCart, [
    initializes,
    waitsForAddItem,
    // we're going to dispatch this action right in the saga
    // so let's send a value to the saga
    gets(actions.addItem({item})),
    // it should update the local storage now
    calls('lockr.sadd', 'items', item),
    // and make an api call
    calls('api.shoppingCartAddItem', item)
  ]);

  testSaga(shoppingCart, [
    initializes,
    waitsForAddItem,
    // what if we pass an action without an item?
    gets(actions.addItem()),
    // it should not update the local storage
    waitsForAddItem
  ]);
});
