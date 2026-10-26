/**
 * Canonical page-level management switch for the shared PacoGO template.
 *
 * The page template owns the switch placement. The navigation contract owns
 * management authorization; this component only switches the current page
 * between its normal and management context.
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

function hasManagementAccess(navigation = []) {
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

export function installPacoManagementSwitch({ templateMount, navigation = [], documentRef = document } = {}) {
  if (!templateMount) throw new TypeError('installPacoManagementSwitch requires templateMount.');

  const canManage = hasManagementAccess(navigation);
  const hero = templateMount.querySelector('.paco-template-hero');
  if (!hero) return null;

  const existing = hero.querySelector('.paco-template-management-switch');
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

  hero.appendChild(button);
  return button;
}
