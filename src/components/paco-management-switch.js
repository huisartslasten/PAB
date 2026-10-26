/**
 * Canonical management switch for the shared PacoGO page template.
 *
 * The page template owns placement. Authentication owns authorization.
 * The switch changes only the current view mode; the shared router and
 * navigation then render the existing management controls for that page.
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

function hasManagementAccess({ app, navigation = [] } = {}) {
  if (typeof app?.auth?.isParent === 'boolean') return app.auth.isParent;
  return navigation.some(item => item?.kind === 'management-mode');
}

function buildCurrentPageManagementUrl() {
  const url = new URL(window.location.href);
  const isManagement = url.searchParams.get('mode') === 'management' || url.searchParams.get('context') === 'management';
  const student = url.searchParams.get('viewStudent') || url.searchParams.get('student') || '';

  url.searchParams.delete('context');
  url.searchParams.set('mode', isManagement ? 'student' : 'management');
  if (student) url.searchParams.set('student', student);
  else url.searchParams.delete('student');
  url.searchParams.delete('viewStudent');
  return url;
}

export function installPacoManagementSwitch({ templateMount, app = null, navigation = [], documentRef = document } = {}) {
  if (!templateMount) throw new TypeError('installPacoManagementSwitch requires templateMount.');

  const canManage = hasManagementAccess({ app, navigation });
  const pageHeader = templateMount.querySelector('.paco-template-page-header');
  if (!pageHeader) return null;

  const existing = pageHeader.querySelector('.paco-template-management-switch');
  if (existing && !canManage) {
    existing.remove();
    return null;
  }
  if (existing) return existing;
  if (!canManage) return null;

  ensureStylesheet(documentRef);

  const button = documentRef.createElement('button');
  button.type = 'button';
  button.className = 'paco-template-management-switch';
  button.textContent = 'Beheer';
  button.setAttribute('aria-label', 'Beheer op deze pagina');
  button.title = 'Beheer op deze pagina';

  const isManagement = new URL(window.location.href).searchParams.get('mode') === 'management';
  button.dataset.enabled = 'true';
  button.dataset.active = String(isManagement);
  button.setAttribute('aria-pressed', String(isManagement));

  button.addEventListener('click', () => {
    window.location.assign(buildCurrentPageManagementUrl().toString());
  });

  pageHeader.appendChild(button);
  return button;
}
