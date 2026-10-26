import { createPacoGOApp } from './bootstrap.js';
import { createPacoRouter } from '../core/router.js';
import { createPacoRouteRegistry } from './routes.js';
import { installPacoManagementSwitch } from '../components/paco-management-switch.js';

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

  router.onChange(() => {
    installPacoManagementSwitch({ templateMount, app, router, documentRef });
  });

  return Object.freeze({ app, router, routes });
}

export function startPacoRuntime(options = {}) {
  const runtime = createPacoRuntime(options);
  const stop = runtime.router.start();
  return Object.freeze({
    ...runtime,
    stop
  });
}
