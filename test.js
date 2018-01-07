import { defroute, routeTo } from './index';

const routes = [
  [defroute`/people`, (page) => 'index'],
  [defroute`/people/${'id'}`, (page, params) => ['show', params.id]],
];

function equal(a, b) {
  if (a !== b) {
    throw `expected ${a} to equal ${b}`;
  }
}

const tests = {
  'routeTo index works': () => {
    const response = routeTo('page', routes, '/people');
    equal(response, 'index');
  },
  'routeTo show works': () => {
    const response = routeTo('page', routes, '/people/5');
    equal(response[0], 'show')
    equal(response[1], '5');
  },
};

let failures = 0;
let successes = 0;

for (let [name, test] of Object.entries(tests)) {
  try {
    test();
    successes++;
    console.log(name, 'passed');
  } catch (e) {
    failures++;
    console.error(name, 'failed');
  }
}

console.log('tests passed', successes, 'tests failed', failures);

if (failures > 0) {
  throw new Error('not all tests passed');
}
