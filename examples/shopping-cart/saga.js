const {get, sadd} = require('lockr');
const {actionChannel, take, call} = require('redux-saga/effects');
const {
  buffers: {sliding}
} = require('redux-saga');
const actions = require('./actions');

module.exports = shoppingCart;

const api = {
  shoppingCartAddItem: item =>
    new Promise(resolve => setTimeout(resolve, 0, item)),
  shoppingCartSubmit: items =>
    new Promise(resolve => setTimeout(resolve, 0, items))
};
module.exports.api = api;

function* submit() {
  const items = yield call(get, 'items');
  if (!items || items.length === 0) {
    return;
  }
  yield call(api.shoppingCartSubmit, items);
}

function* addItem({item}) {
  if (!item) {
    return;
  }
  yield call(sadd, 'items', item);
  yield call(api.shoppingCartAddItem, item);
}

function* shoppingCart() {
  const channel = yield actionChannel(
    [actions.submit.type, actions.addItem.type],
    sliding(1)
  );

  for (;;) {
    const action = yield take(channel);
    switch (action.type) {
      case actions.submit.type:
        yield* submit();
        break;

      case actions.addItem.type:
        yield* addItem(action);
        break;

      // skip default
    }
  }
}
