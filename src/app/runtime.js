import { createPacoGOApp } from './bootstrap.js';
import { createPacoRouter } from '../core/router.js';
import { createPacoRouteRegistry } from './routes.js';

export function createPacoRuntime({
  supabaseLib = window.supabase,
  templateMount,
  chooserMount,
  documentRef = document,
  session = null,
  storage = globalThis.localStorage
} = {}) {
  if (!templateMount) throw new TypeError('Paco runtime requires a template mount.');

  const app = createPacoGOApp({ supabaseLib, session, storage });
  const routes = createPacoRouteRegistry({
    app,
    mounts: { templateMount, chooserMount },
    documentRef
  });
  const router = createPacoRouter({ windowRef: window, routes });

  async function renderRoute(route) {
    if (typeof route?.renderer !== 'function') return null;
    const runtime = route.renderer(route);
    if (!runtime || typeof runtime.mount !== 'function') {
      throw new TypeError(`Paco route renderer for ${route.path} must return a mountable runtime.`);
    }
    await runtime.mount();
    return runtime;
  }

  return Object.freeze({ app, router, routes, renderRoute });
}

export async function startPacoRuntime(options = {}) {
  const runtime = createPacoRuntime(options);
  const stop = runtime.router.start();
  const unsubscribe = runtime.router.onChange(route => {
    void runtime.renderRoute(route);
  });
  await runtime.renderRoute(runtime.router.getRoute());
  return Object.freeze({
    ...runtime,
    stop: () => {
      unsubscribe();
      stop();
    }
  });
}
