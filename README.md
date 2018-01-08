# Lit-Router

## Install

```
yarn add lit-router
```

## Usage

```
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

## Background

This is a simple router that takes advantage of how [tagged template literals](https://ponyfoo.com/articles/es6-template-strings-in-depth#demystifying-tagged-templates) work in ES6 to define route objects. It was inspired by seeing how [lit-html](https://github.com/PolymerLabs/lit-html) works.
