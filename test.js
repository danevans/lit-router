import assert from 'assert';
import { defroute, routeTo, urlFor } from './index';

const oldRoutes = [
  [defroute`/people`, (page) => 'index'],
  [defroute`/people/${'id'}`, (page, params) => ['show', params.id]],
];

const routes = {
  index: [defroute`/people`, (page) => 'index'],
  show: [defroute`/people/${'id'}`, (page, params) => ['show', params.id]],
};

const tests = {
  // Old-style with an array of unnamed routes
  'with old routes, routeTo index works'() {
    const response = routeTo('page', oldRoutes, '/people');
    assert.equal(response, 'index');
  },
  'with old routes, routeTo show works'() {
    const response = routeTo('page', oldRoutes, '/people/5');
    assert.equal(response[0], 'show')
    assert.equal(response[1], '5');
  },

  // New style with an object containing names and routes
  'routeTo index works'() {
    const response = routeTo('page', routes, '/people');
    assert.equal(response, 'index');
  },
  'routeTo show works'() {
    const response = routeTo('page', routes, '/people/5');
    assert.equal(response[0], 'show')
    assert.equal(response[1], '5');
  },
  'routeTo an unknown route throws'() {
    assert.throws(() => {
      routeTo('page', routes, '/companies');
    });
  },

  // Reverse route, use name to create a URL
  'urlFor index works'() {
    const url = urlFor(routes, 'index');
    assert.equal(url, '/people');
  },
  'urlFor show works'() {
    const url = urlFor(routes, 'show', { id: 415 });
    assert.equal(url, '/people/415');
  },
  'urlFor throws with missing params'() {
    assert.throws(() => {
      urlFor(routes, 'show'),
      Error
    });
  }
};

const results = {
  failures: 0,
  successes: 0,
};

for (let [name, test] of Object.entries(tests)) {
  try {
    test();
    results.successes++;
    console.log('✅', name);
  } catch (e) {
    results.failures++;
    console.error('❌', name, e);
  }
}

console.log('tests passed', results.successes, 'tests failed', results.failures);

if (results.failures > 0) {
  throw new Error('not all tests passed');
}
