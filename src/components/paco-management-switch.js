/**
 * Shared management capability trigger for the page template.
 *
 * The page template owns placement. Authentication owns authorization.
 * The central management capability registry owns available actions and the
 * page-local management visibility state. This component only presents it.
 */

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

function hasManagementAccess({ app } = {}) {
  return app?.auth?.isParent === true;
}

function currentPageKey() {
  const page = window.location.pathname.split('/').pop() || 'dashboard.html';
  return page.replace(/\.html$/i, '');
}

function currentStudent() {
  const url = new URL(window.location.href);
  return url.searchParams.get('viewStudent') || url.searchParams.get('student') || '';
}

function createCapabilityPanel({ documentRef, capabilities, navigate, button }) {
  const panel = documentRef.createElement('div');
  panel.className = 'paco-management-capability-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'menu');

  capabilities.forEach(capability => {
    const action = documentRef.createElement('button');
    action.type = 'button';
    action.className = 'paco-management-capability-action';
    action.textContent = capability.label;
    action.setAttribute('role', 'menuitem');
    action.addEventListener('click', () => {
      if (!capability.target) return;
      navigate(capability.target, { managementCapability: capability.id });
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    });
    panel.appendChild(action);
  });

  return panel;
}

export function installPacoManagementSwitch({ templateMount, app = null, navigate = null, documentRef = document } = {}) {
  if (!templateMount) throw new TypeError('installPacoManagementSwitch requires templateMount.');
  if (typeof navigate !== 'function') throw new TypeError('installPacoManagementSwitch requires the central navigation owner.');

  const canManage = hasManagementAccess({ app });
  const pageHeader = templateMount.querySelector('.paco-template-page-header');
  if (!pageHeader) return null;

  const existing = pageHeader.querySelector('.paco-template-management-switch');
  if (existing) existing.closest('.paco-management-capability-wrap')?.remove();
  if (!canManage || !app?.managementCapabilities) return null;

  const page = currentPageKey();
  const capabilities = app.managementCapabilities.getAvailableForPage({
    page,
    student: currentStudent()
  });
  if (!capabilities.length) return null;

  ensureStylesheet(documentRef);

  const wrap = documentRef.createElement('div');
  wrap.className = 'paco-management-capability-wrap';

  const button = documentRef.createElement('button');
  button.type = 'button';
  button.className = 'paco-template-management-switch';
  button.textContent = 'Beheer';
  button.setAttribute('aria-label', 'Beheer op deze pagina');
  button.title = 'Beheer op deze pagina';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-haspopup', 'menu');

  const panel = createCapabilityPanel({ documentRef, capabilities, navigate, button });
  button.addEventListener('click', () => {
    const nextOpen = panel.hidden;
    panel.hidden = !nextOpen;
    button.setAttribute('aria-expanded', String(nextOpen));
    app.managementCapabilities.setPageActive(page, nextOpen);
  });

  wrap.append(button, panel);
  pageHeader.appendChild(wrap);
  return button;
}
