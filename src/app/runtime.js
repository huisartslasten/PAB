import { createPacoGOApp } from './bootstrap.js';
import { createPacoRouter } from '../core/router.js';
import { createPacoRouteRegistry } from './routes.js';
import { installPacoManagementSwitch } from '../components/paco-management-switch.js';
import { syncPacoGlobalManagementBar } from '../components/paco-global-management-bar.js';
import { createManagementTopbar } from '../features/management/management-context.js';

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
  const router = createPacoRouter({
    windowRef: window,
    routes,
    managementCapabilities: app.managementCapabilities
  });

  const syncManagementBar = () => syncPacoGlobalManagementBar({
    app,
    createTopbar: createManagementTopbar,
    navigate: router.navigate,
    documentRef
  });

  router.onChange(() => {
    void syncManagementBar();
    installPacoManagementSwitch({
      templateMount,
      app,
      navigate: router.navigate,
      documentRef
    });
  });

  return Object.freeze({ app, router, routes });
}

export async function startPacoRuntime(options = {}) {
  const runtime = createPacoRuntime(options);
  const stop = runtime.router.start();

  void runtime.app.initializeSession().then(() => syncPacoGlobalManagementBar({
    app: runtime.app,
    createTopbar: createManagementTopbar,
    navigate: runtime.router.navigate,
    documentRef: options.documentRef || document
  })).catch(error => {
    console.error('PacoGO session initialization error:', error);
  });

  return Object.freeze({
    ...runtime,
    stop
  });
}
