# test-saga
[![Build Status](https://travis-ci.org/ayatkevich/test-saga.svg?branch=master)](https://travis-ci.org/ayatkevich/test-saga)

Work in progress! A bunch of helpers to make redux-saga testing more powerful.

## Why?

[WIP]

## Examples

### White-box testing

Let's assume we want to develop an auth saga.

```js
import {testSaga} from 'test-saga/white-box';

function * auth() {
}

test(() => testSaga(auth, []));
```

Before we start listening for any user triggered action it would be handy to
check if there is any saved session in the browser local storage.

So we can do something like this to check it:

```js
import {testSaga, calls} from 'test-saga/white-box';

function * auth() {
}

test('check if there is any saved session in the browser', () =>
  testSaga(auth, [
    calls('localStorage.getItem', 'idToken')
  ])
);
```

When we run this code there will be an AssertionError thrown with the message:

```
Expected:
  yield call(localStorage.getItem, "idToken");
Got:
  nothing
```

And the working implementation for this would be something like:

```js
import {testSaga, calls} from 'test-saga/white-box';

import {get} from 'lockr';
import {call} from 'redux-saga/effects';

const getItem = ::localStorage.getItem;

function * auth() {
  yield call(get, 'idToken');
}

test('check if there is any saved session in the browser', () =>
  testSaga(auth, [
    calls('localStorage.getItem', 'idToken')
  ])
);
```

Notice, that `calls` does not actually check if we pass the same function.
The helper will use 'localStorage.getItem' to print assertion error.
And you can actually pass any function in the implementation.

If you want to check that our saga calls exact function, you can pass not a
string value to the calls helper as a first argument but a function itself.

So,

```js
import {testSaga, calls} from 'test-saga/white-box';

import {get} from 'lockr';
import {call} from 'redux-saga/effects';

const getItem = ::localStorage.getItem;

function * auth() {
  yield call(get, 'idToken');
}

test(`check if there is any saved session in the browser,
      and if user is already authorized inform React about it`, () =>
  testSaga(auth, [
    calls(getItem, 'idToken')
  ])
);
```
