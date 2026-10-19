/**
 * PacoGO central client-side route state.
 *
 * The router owns URL state and route transitions. It deliberately does not
 * render pages or know feature-specific business logic; callers register the
 * renderer for each route and receive a normalized URL object.
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

  function notify(route, { replace = false, popstate = false } = {}) {
    const event = { ...route, replace, popstate };
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
    has: path => routeTable.has(normalizePath(path)),
    register: (path, renderer) => {
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
