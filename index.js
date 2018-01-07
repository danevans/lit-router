const notSlash = '([^/]+)';

/**
 * defroute is a template tag meant to be called on a route template string
 * A template string looks like:
 *    ```
 *    defroute`/users/${'id'}`
 *    ```
 * @param  {string} strParts[] - The static parts of the path.
 * @param  {string} keys[] - The names of the dynamic parameters which will be
 *                           parsed out of the path.
 * @return {regexp} - This will match strings that are of the form which should
 *                    be handled by this route. It has the dynamic keys attached
 *                    to it so that they can be used to construct the params in
 *                    the matchRoute function.
 */
export function defroute(strParts, ...keys) {
  const assembledString = strParts.reduce(function(accumulator, part, index) {
    if (keys[index]) {
      return accumulator + part + notSlash;
    } else {
      return accumulator + part;
    }
  }, '^');
  const r = new RegExp(assembledString + '$');
  r.keys = keys;
  return r;
}

/**
 * matchRoute finds a route that matches a path and returns a function which
 * provides the handler with any params that came from the path.
 * routes looks like:
 *    ```
 *    [
 *      [defroute`/users`, (page) => ...],
 *      [defroute`/users/${'id'}`, (page, params) => ...]
 *    ]
 *    ```
 * @param  {array[]} routes - An array of routes which are themselves arrays
 * @param  {array} routes[] - A route which is an array of a matcher and handler
 * @param  {regexp} routes[][0] - Decides whether the path matches this route.
 * @param  {function} routes[][1] - Will be called in the returned handler function
 * @param  {string} path - The path part of a URL to test against the routes
 * @return {function} - A handler function to be called with the page argument.
 *                      Used by routeTo.
 */
export function matchRoute(routes, path) {
  const [matcher, handler] = routes.find(function([matcher, handler]) {
    return matcher.test(path);
  });
  if (handler) {
    const matches = path.match(matcher);
    const params = matcher.keys.reduce(function(accumulator, key, index) {
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
    throw new Error('No route matches');
  }
}
