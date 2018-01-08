# Lit-Router

This is a simple router that takes advantage of how [tagged template literals](https://ponyfoo.com/articles/es6-template-strings-in-depth#demystifying-tagged-templates) work in ES6 to define route objects. It was inspired by seeing how [lit-html](https://github.com/PolymerLabs/lit-html) works.

This router provides a function that will map from a URL (as a string) to a block of code and (in the opposite direction) a function that will map from a name to a URL.

It does not manage a browser's location or history objects.

## Install

```
yarn add lit-router
```

## Usage

```js
import { defroute, routeTo, urlFor } from 'lit-router';

const routes = {
  index: [defroute`/users`, (context) => {}],
  show: [defroute`/users/${'id'}`, (context, params) => {}]
};

const context = {};

routeTo(context, routes, window.location.pathname);

urlFor(routes, 'show', { id: 5 });
// => '/users/5'
```

## Tests

To run the tests in node run:
```
yarn test
```

To run them in a browser run:
```
yarn server
```
