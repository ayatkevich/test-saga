const action = require('action-helper');

module.exports = {
  login: action('LOGIN'),
  logout: action('LOGOUT'),

  authenticated: action('AUTHENTICATED', 'idToken'),
  unauthenticated: action('UNAUTHENTICATED')
};
