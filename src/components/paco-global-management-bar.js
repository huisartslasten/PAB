import { createPacoManagementTopbar } from './page-template.js';
import { readViewContext } from '../core/view-context.js';

const GLOBAL_BAR_ID = 'paco-global-management-bar';

/**
 * Global presentation host for the authenticated management context bar.
 *
 * The management feature supplies the context actions; this shared component
 * owns only DOM placement so the bar survives page-template replacement.
 */
export async function syncPacoGlobalManagementBar({ app, navigate, createTopbar, documentRef = document } = {}) {
  if (!app) throw new TypeError('Global management bar requires app.');
  if (typeof navigate !== 'function') throw new TypeError('Global management bar requires navigation owner.');
  if (typeof createTopbar !== 'function') throw new TypeError('Global management bar requires a topbar factory.');

  const existing = documentRef.getElementById(GLOBAL_BAR_ID);
  const session = await app.initializeSession();

  if (!session || !app.auth?.isParent) {
    existing?.remove();
    return null;
  }

  const url = new URL(window.location.href);
  const context = readViewContext(url.searchParams);
  const topbar = createTopbar({
    app,
    student: context.student,
    managementFilter: context.managementFilter || 'dashboard',
    navigate
  });
  const next = createPacoManagementTopbar({ topbar, documentRef });
  next.id = GLOBAL_BAR_ID;

  if (existing) existing.replaceWith(next);
  else documentRef.body.prepend(next);
  return next;
}
