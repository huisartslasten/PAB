/**
 * Canonical page-level management switch for the shared PacoGO template.
 *
 * The template owns the hero; this component owns the reusable switch behavior
 * and delegates navigation to the canonical router/view-context boundary.
 */

import { buildViewUrl, VIEW_MODES } from '../core/view-context.js';

const STYLE_HREF = 'src/components/paco-management-switch.css';

function ensureStylesheet(documentRef) {
  const existing = documentRef.querySelector(`link[data-paco-management-switch="${STYLE_HREF}"]`);
  if (existing) return;

  const link = documentRef.createElement('link');
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  link.dataset.pacoManagementSwitch = STYLE_HREF;
  documentRef.head.appendChild(link);
}

export function installPacoManagementSwitch({ templateMount, app, router, documentRef = document } = {}) {
  if (!templateMount) throw new TypeError('installPacoManagementSwitch requires templateMount.');
  if (!app?.auth) throw new TypeError('installPacoManagementSwitch requires app.auth.');
  if (!router?.getRoute || !router?.navigate) throw new TypeError('installPacoManagementSwitch requires the canonical router.');

  ensureStylesheet(documentRef);

  const hero = templateMount.querySelector('.paco-template-hero');
  if (!hero) return null;

  const existing = hero.querySelector('.paco-template-management-switch');
  if (existing) return existing;

  const button = documentRef.createElement('button');
  button.type = 'button';
  button.className = 'paco-template-management-switch';
  button.textContent = 'Beheer';
  button.setAttribute('aria-label', 'Beheer op deze pagina');
  button.title = 'Beheer op deze pagina';

  const updateState = () => {
    const canManage = Boolean(app.auth.isParent);
    const route = router.getRoute();
    const isManagement = route.params?.get('mode') === VIEW_MODES.MANAGEMENT || route.params?.get('context') === VIEW_MODES.MANAGEMENT;

    button.dataset.enabled = String(canManage);
    button.dataset.active = String(isManagement && canManage);
    button.setAttribute('aria-pressed', String(isManagement && canManage));
  };

  button.addEventListener('click', () => {
    if (!app.auth.isParent) return;

    const route = router.getRoute();
    const isManagement = route.params?.get('mode') === VIEW_MODES.MANAGEMENT || route.params?.get('context') === VIEW_MODES.MANAGEMENT;
    const student = route.params?.get('viewStudent') || route.params?.get('student') || '';
    const nextMode = isManagement ? VIEW_MODES.STUDENT : VIEW_MODES.MANAGEMENT;
    const target = buildViewUrl(route.url, { student, mode: nextMode });
    void router.navigate(target);
  });

  app.auth.subscribe(updateState);
  hero.appendChild(button);
  updateState();
  return button;
}
