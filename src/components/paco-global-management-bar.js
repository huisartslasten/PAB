import { createPacoManagementTopbar } from './page-template.js';
import { createManagementTopbar } from '../features/management/management-context.js';
import { readViewContext } from '../core/view-context.js';

const GLOBAL_BAR_ID = 'paco-global-management-bar';

/**
 * Canonical authenticated management context bar.
 *
 * Placement is global and route-independent; management-context owns the
 * learner switching, learner perspective and logout actions.
 */
export async function syncPacoGlobalManagementBar({ app, navigate, documentRef = document } = {}) {
  if (!app) throw new TypeError('Global management bar requires app.');
  if (typeof navigate !== 'function') throw new TypeError('Global management bar requires navigation owner.');

  const existing = documentRef.getElementById(GLOBAL_BAR_ID);
  const session = await app.initializeSession();

  if (!session || !app.auth?.isParent) {
    existing?.remove();
    return null;
  }

  const url = new URL(window.location.href);
  const context = readViewContext(url.searchParams);
  const topbar = createManagementTopbar({
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
