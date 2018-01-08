import assert from 'assert';
import { defroute, routeTo } from './index';

const routes = [
  [defroute`/people`, (page) => 'index'],
  [defroute`/people/${'id'}`, (page, params) => ['show', params.id]],
];

const tests = {
  'routeTo index works': () => {
    const response = routeTo('page', routes, '/people');
    assert.equal(response, 'index');
  },
  'routeTo show works': () => {
    const response = routeTo('page', routes, '/people/5');
    assert.equal(response[0], 'show')
    assert.equal(response[1], '5');
  },
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
