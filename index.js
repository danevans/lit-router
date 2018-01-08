const notSlash = '([^/]+)';

class Route {
  constructor(strParts, keys) {
    this.strParts = strParts;
    this.keys = keys;

    const assembledString = strParts.reduce((accumulator, part, index) => {
      return accumulator + part + (keys[index] ? notSlash : '');
    }, '^');
    this.matcher = new RegExp(`${assembledString}$`);
  }

  toURL(params = {}) {
    return this.strParts.reduce((accumulator, part, index) => {
      const key = this.keys[index];
      if (key) {
        if (!params[key]) {
          throw new Error(`Missing required param: ${key}`);
        }
        return accumulator + part + params[key];
      } else {
        return accumulator + part;
      }
    }, '');
  }
}

/**
 * defroute is a template tag meant to be called on a route template string
 * A template string looks like:
 *    ```
 *    defroute`/users/${'id'}`
 *    ```
 * @param  {string} strParts[] - The static parts of the path.
 * @param  {string} keys[] - The names of the dynamic parameters which will be
 *                           parsed out of the path.
 * @return {route} - This will match strings that are of the form which should
 *                   be handled by this route. It has the dynamic keys attached
 *                   to it so that they can be used to construct the params in
 *                   the matchRoute function.
 */
export function defroute(strParts, ...keys) {
  return new Route(strParts, keys);
}

/**
 * matchRoute finds a route that matches a path and returns a function which
 * provides the handler with any params that came from the path.
 * routes looks like:
 *    ```
 *    {
 *      allUsers: [defroute`/users`, (page) => ...],
 *      showUser: [defroute`/users/${'id'}`, (page, params) => ...]
 *    }
 *    ```
 * @param  {object} routes - An array of routes which are themselves arrays
 * @param  {array} routes.name - A route which is an array of a route and handler
 * @param  {route} routes.name[0] - Used for deciding whether this path matches
 * @param  {function} routes.name[1] - Will be called in the returned handler function
 * @param  {string} path - The path part of a URL to test against the routes
 * @return {function} - A handler function to be called with the page argument.
 *                      Used by routeTo.
 */
export function matchRoute(routes, path) {
  const [route, handler] = Object.values(routes).find(([route, handler]) => {
    return route.matcher.test(path);
  });
  if (handler) {
    const matches = path.match(route.matcher);
    const params = route.keys.reduce((accumulator, key, index) => {
      // The first entry is the whole path
      accumulator[key] = matches[index + 1];
      return accumulator;
    }, {});
    return (page) => handler(page, params);
  }
}

export function routeTo(page, routes, path) {
  const handler = matchRoute(routes, path);
  if (handler) {
    return handler(page);
  } else {
    throw new Error(`No route matches: ${path}`);
  }
}

export function urlFor(routes, name, params = {}) {
  const [route] = routes[name];
  if (!route) {
    throw new Error(`No route matches: ${key}`);
  }
  return route.toURL(params);
}
