/**
 * PacoGO central client-side route state and rendering contract.
 *
 * The router owns URL state and route transitions. It does not know feature
 * business logic; callers register the renderer for each route.
 */

function normalizePath(path) {
  const value = String(path || '/').replace(/^\/+/, '');
  return value || 'index.html';
}

export function createPacoRouter({ windowRef = window, routes = {} } = {}) {
  const listeners = new Set();
  const routeTable = new Map(Object.entries(routes));

  function resolve(input = windowRef.location.href) {
    const url = input instanceof URL
      ? new URL(input.toString())
      : new URL(String(input), windowRef.location.href);
    const path = normalizePath(url.pathname.split('/').pop());
    return {
      path,
      url,
      params: new URLSearchParams(url.search)
    };
  }

  function getRenderer(route) {
    return routeTable.get(route.path) || null;
  }

  function notify(route, { replace = false, popstate = false } = {}) {
    const event = { ...route, replace, popstate, renderer: getRenderer(route) };
    listeners.forEach(listener => listener(event));
    return event;
  }

  function navigate(input, { replace = false } = {}) {
    const route = resolve(input);
    const method = replace ? 'replaceState' : 'pushState';
    windowRef.history[method]({}, '', route.url.toString());
    return notify(route, { replace });
  }

  function start() {
    const onPopState = () => notify(resolve(), { popstate: true });
    windowRef.addEventListener('popstate', onPopState);
    return () => windowRef.removeEventListener('popstate', onPopState);
  }

  return {
    getRoute: () => resolve(),
    getRenderer,
    has: path => routeTable.has(normalizePath(path)),
    register: (path, renderer) => {
      if (typeof renderer !== 'function') throw new TypeError('A PacoGO route renderer must be a function.');
      routeTable.set(normalizePath(path), renderer);
      return () => routeTable.delete(normalizePath(path));
    },
    resolve,
    navigate,
    onChange: listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    start
  };
}
