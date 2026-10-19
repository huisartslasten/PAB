/**
 * PacoGO central client-side route state and rendering contract.
 *
 * The router owns URL state and route transitions. Route renderers own feature
 * composition and rendering; the router only supplies navigation context.
 * Runtime mounts synchronously establish the canonical shell and may continue
 * loading feature data asynchronously afterwards.
 */

function normalizePath(path) {
  const value = String(path || '/').replace(/^\/+/, '');
  return value || 'index.html';
}

export function createPacoRouter({ windowRef = window, routes = {} } = {}) {
  const listeners = new Set();
  const routeTable = new Map(Object.entries(routes));
  let activeRenderer = null;

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

  async function render(route) {
    const renderer = getRenderer(route);
    if (typeof renderer !== 'function') return null;

    if (activeRenderer && typeof activeRenderer.destroy === 'function') {
      await activeRenderer.destroy();
    }

    const runtime = await renderer({ url: route.url, navigate });
    activeRenderer = runtime || null;
    if (runtime && typeof runtime.mount === 'function') {
      const mountResult = runtime.mount();
      if (mountResult && typeof mountResult.catch === 'function') {
        mountResult.catch(error => {
          console.error('PacoGO route mount error:', error);
        });
      }
    }
    return runtime;
  }

  async function notify(route, { replace = false, popstate = false } = {}) {
    const event = { ...route, replace, popstate, renderer: getRenderer(route) };
    await render(route);
    listeners.forEach(listener => listener(event));
    return event;
  }

  async function navigate(input, { replace = false } = {}) {
    const route = resolve(input);
    await render(route);
    const method = replace ? 'replaceState' : 'pushState';
    windowRef.history[method]({}, '', route.url.toString());
    listeners.forEach(listener => listener({ ...route, replace, popstate: false, renderer: getRenderer(route) }));
    return { ...route, replace, popstate: false, renderer: getRenderer(route) };
  }

  function start() {
    const onPopState = () => { void notify(resolve(), { popstate: true }); };
    windowRef.addEventListener('popstate', onPopState);
    void notify(resolve());
    return () => windowRef.removeEventListener('popstate', onPopState);
  }

  return {
    getRoute: () => resolve(),
    getRenderer,
    getActiveRenderer: () => activeRenderer,
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
