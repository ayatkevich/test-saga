const action = require('action-helper');

module.exports = {
  submit: action('shopping-cart/SUBMIT'),
  addItem: action('shopping-cart/ADD_ITEM', 'item')
};
