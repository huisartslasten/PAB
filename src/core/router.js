/**
 * PacoGO central client-side route state and rendering contract.
 *
 * The router owns URL state, route transitions and route asset readiness.
 * Route renderers own feature composition and rendering; the router only
 * supplies navigation context and makes route styles available before mount.
 */

function normalizePath(path) {
  const value = String(path || '/').replace(/^\/+/, '');
  return value || 'index.html';
}

function normalizeStyles(styles) {
  return [...new Set((Array.isArray(styles) ? styles : []).map(style => String(style || '').trim()).filter(Boolean))];
}

function createRouteStyleManager(documentRef) {
  let active = new Map();

  function findStylesheet(href) {
    const absoluteHref = new URL(href, documentRef.baseURI).toString();
    return [...documentRef.head.querySelectorAll('link[rel="stylesheet"]')]
      .find(link => link.href === absoluteHref || link.getAttribute('href') === href) || null;
  }

  function loadStylesheet(href) {
    const existing = findStylesheet(href);
    if (existing) {
      if (existing.sheet) return Promise.resolve(existing);
      return new Promise((resolve, reject) => {
        existing.addEventListener('load', () => resolve(existing), { once: true });
        existing.addEventListener('error', () => reject(new Error(`Failed to load PacoGO route stylesheet: ${href}`)), { once: true });
      });
    }

    const link = documentRef.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.pacoRouteStyle = href;

    return new Promise((resolve, reject) => {
      link.addEventListener('load', () => resolve(link), { once: true });
      link.addEventListener('error', () => reject(new Error(`Failed to load PacoGO route stylesheet: ${href}`)), { once: true });
      documentRef.head.appendChild(link);
    });
  }

  async function activate(styles) {
    const hrefs = normalizeStyles(styles);
    const next = new Map();
    const loaded = await Promise.all(hrefs.map(async href => [href, await loadStylesheet(href)]));

    loaded.forEach(([href, link]) => next.set(href, link));

    active.forEach((link, href) => {
      if (!next.has(href)) link.remove();
    });

    active = next;
  }

  return Object.freeze({
    activate,
    getActive: () => new Map(active)
  });
}

export function createPacoRouter({ windowRef = window, routes = {}, documentRef = windowRef.document || globalThis.document } = {}) {
  const listeners = new Set();
  const routeTable = new Map(Object.entries(routes));
  const routeStyles = createRouteStyleManager(documentRef);
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
    const renderer = routeTable.get(route.path) || null;
    return typeof renderer === 'function' ? renderer : renderer?.render || null;
  }

  function getStyles(route) {
    const renderer = routeTable.get(route.path);
    return normalizeStyles(typeof renderer === 'function' ? renderer.styles : renderer?.styles);
  }

  async function render(route) {
    const renderer = getRenderer(route);
    if (typeof renderer !== 'function') return null;

    await routeStyles.activate(getStyles(route));

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
    getRouteStyles: route => getStyles(typeof route === 'string' ? resolve(route) : route),
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
