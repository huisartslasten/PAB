/**
 * Canonical management switch for the shared PacoGO page template.
 *
 * The page template owns placement. Authentication owns authorization.
 * The shared router owns view transitions; this component only requests
 * the current page in the other supported view mode.
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

function buildCurrentPageManagementUrl() {
  const url = new URL(window.location.href);
  const isManagement = url.searchParams.get('mode') === 'management' || url.searchParams.get('context') === 'management';
  const student = url.searchParams.get('viewStudent') || url.searchParams.get('student') || '';

  url.searchParams.delete('context');
  url.searchParams.set('mode', isManagement ? 'student' : 'management');
  if (student) url.searchParams.set('viewStudent', student);
  else url.searchParams.delete('viewStudent');
  url.searchParams.delete('student');
  return url;
}

export function installPacoManagementSwitch({ templateMount, app = null, navigate = null, documentRef = document } = {}) {
  if (!templateMount) throw new TypeError('installPacoManagementSwitch requires templateMount.');
  if (navigate !== null && typeof navigate !== 'function') throw new TypeError('installPacoManagementSwitch requires the central navigation owner.');

  const canManage = hasManagementAccess({ app });
  const pageHeader = templateMount.querySelector('.paco-template-page-header');
  if (!pageHeader) return null;

  const existing = pageHeader.querySelector('.paco-template-management-switch');
  if (existing && !canManage) {
    existing.remove();
    return null;
  }
  if (existing) {
    if (navigate) existing.__pacoNavigate = navigate;
    return existing;
  }
  if (!canManage || !navigate) return null;

  ensureStylesheet(documentRef);

  const button = documentRef.createElement('button');
  button.type = 'button';
  button.className = 'paco-template-management-switch';
  button.textContent = 'Beheer';
  button.setAttribute('aria-label', 'Beheer op deze pagina');
  button.title = 'Beheer op deze pagina';
  button.__pacoNavigate = navigate;

  const updateState = () => {
    const isManagement = new URL(window.location.href).searchParams.get('mode') === 'management';
    button.dataset.enabled = 'true';
    button.dataset.active = String(isManagement);
    button.setAttribute('aria-pressed', String(isManagement));
  };

  updateState();
  button.addEventListener('click', () => {
    const nextUrl = buildCurrentPageManagementUrl();
    button.__pacoNavigate(nextUrl);
  });

  pageHeader.appendChild(button);
  return button;
}
