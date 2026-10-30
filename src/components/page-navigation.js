import { listStudents } from '../core/student-registry.js';
import { confirmPacoAction } from './confirm-dialog.js';
import { buildViewUrl } from '../core/view-context.js';

function currentPage() { return window.location.pathname.split('/').pop() || 'dashboard.html'; }
function go(navigate, path, { student = '', managementFilter = '', extra = {} } = {}) {
  if (typeof navigate !== 'function') throw new TypeError('PacoGO shared navigation requires the central navigation owner.');
  return navigate(buildViewUrl(path, { student, managementFilter, extra }));
}
function requireNavigationApp(app, includeAccount) { if (!includeAccount) return; if (!app?.auth || !app?.authSession) throw new Error('createPacoNavigation requires the application context when includeAccount is enabled.'); }

export function createPacoNavigation({ app = null, active = '', activeSubmenu = '', student = '', managementStudents = [], onSelectManagementStudent = null, includeManagementStudentSelector = false, includeManagementDashboard = false, includeManagementDashboardStudentSubmenu = true, includeManagement = true, includeManagementTools = false, includeCreator = false, includeLessons = true, includePractice = true, includeSkills = true, includeAgenda = true, includeAccount = true, hideActive = false, navigate } = {}) {
  requireNavigationApp(app, includeAccount);
  if (typeof navigate !== 'function') throw new TypeError('createPacoNavigation requires a navigation owner.');
  const showManagementLearnerBar = includeManagementStudentSelector;
  const showManagementDashboard = includeManagementDashboard;
  const learners = managementStudents.length ? managementStudents : listStudents();
  const items = [];

  if (showManagementLearnerBar) {
    items.push({ key: 'management-student', kind: 'student-context', label: 'LEERLING', submenu: learners.map(name => ({ key: `management-student-${name}`, label: name, active: name === student, onClick: () => typeof onSelectManagementStudent === 'function' ? onSelectManagementStudent(name) : go(navigate, currentPage(), { student: name }) })) });
  }

  items.push({
    key: 'dashboard',
    icon: '🏠',
    label: 'Dashboard',
    onClick: () => go(navigate, showManagementDashboard ? 'management.html' : 'dashboard.html', { student }),
    active: active === 'dashboard' || active === 'management-dashboard'
  });
  if (showManagementDashboard) {
    items[items.length - 1].key = 'management-dashboard';
    items[items.length - 1].active = active === 'management-dashboard';
    if (includeManagementDashboardStudentSubmenu) {
      items[items.length - 1].submenu = learners.map(name => ({ key: `management-student-${name}`, label: name, active: name === student, onClick: () => typeof onSelectManagementStudent === 'function' ? onSelectManagementStudent(name) : go(navigate, 'management.html', { student: name }) }));
    }
  }
  if (includeLessons) items.push({ key: 'lessons', icon: '📚', label: 'Mijn vakken', onClick: () => go(navigate, 'lessons.html', { student }) });
  if (includeSkills) items.push({ key: 'skills', icon: '⚡', label: 'Skills', onClick: () => go(navigate, 'skills.html', { student }) });
  if (includeAgenda) items.push({ key: 'agenda', icon: '📅', label: 'Mijn agenda', onClick: () => go(navigate, 'agenda.html', { student }), submenu: [
    { key: 'agenda', label: 'Agenda invoeren', active: activeSubmenu === 'agenda', onClick: () => go(navigate, 'agenda.html', { student }) },
    { key: 'month-calendar', label: 'Maandkalender', active: activeSubmenu === 'month-calendar', onClick: () => go(navigate, 'month-calendar.html', { student }) }
  ] });
  items.push({ key: 'test-history', icon: '📝', label: 'Toetsen', onClick: () => go(navigate, 'test-history.html', { student }) });
  if (includeManagementTools) items.push({ key: 'recovery', icon: '🗂️', label: 'Archief / Prullenbak', onClick: () => go(navigate, 'archive.html', { student }) });
  if (includeCreator) items.push({ key: 'creator', icon: '🧠', label: 'Creator Console', onClick: () => go(navigate, 'creator.html', { student }) });
  if (includeManagement && student && app?.managementCapabilities?.getAvailableForPage({ page: 'management', student }).length) {
    items.push({ key: 'management', icon: '⚙️', label: 'Beheer', onClick: () => go(navigate, 'management.html', { student }) });
  }
  if (includeAccount) items.push({ key: 'account', icon: app.auth.isLoggedIn ? '🚪' : '🔐', label: app.auth.isLoggedIn ? 'Uitloggen' : 'Inloggen', onClick: async () => { if (!app.auth.isLoggedIn) { window.location.href = 'auth.html'; return; } const confirmed = await confirmPacoAction({ title: 'Uitloggen?', message: 'Weet je zeker dat je wilt uitloggen?', confirmLabel: 'Ja, uitloggen', cancelLabel: 'Nee' }); if (!confirmed) return; await app.authSession.signOut(); app.auth.setSession(null); window.location.href = 'auth.html'; }, bind: ({ label, icon }) => { const render = session => { const loggedIn = Boolean(session); label.textContent = loggedIn ? 'Uitloggen' : 'Inloggen'; icon.textContent = loggedIn ? '🚪' : '🔐'; }; render(app.auth.session); return app.auth.subscribe(render).unsubscribe; } });
  return items.filter(item => !(hideActive && item.key === active)).map(item => ({ ...item, active: item.active ?? item.key === active }));
}

export function createPacoManagementNavigation({ app, active = '', activeSubmenu = '', student = '', managementStudents = [], navigate } = {}) {
  const filter = new URLSearchParams(window.location.search).get('managementFilter') || 'dashboard';
  const goFilter = nextFilter => go(navigate, 'management.html', { student, managementFilter: nextFilter });
  const goChild = (path, nextFilter = '') => go(navigate, path, { student, managementFilter: nextFilter });
  const makeGroup = (key, label, children) => ({
    key,
    label,
    active: filter === key || children.some(child => child.filter === filter),
    submenu: children.map(child => ({
      key: child.key,
      label: child.label,
      active: false,
      onClick: () => goChild(child.path, child.filter)
    })),
    onClick: () => goFilter(key)
  });

  return [
    { key: 'management-dashboard', icon: '🏠', label: 'Dashboard', active: filter === 'dashboard', onClick: () => goFilter('dashboard') },
    makeGroup('vakken', 'Vakken', [
      { key: 'lessons', label: 'Lessen', filter: 'lessons', path: 'lessons.html' },
      { key: 'learning-material', label: 'Leerstof', filter: 'learning-material', path: 'lessons.html' },
      { key: 'tests', label: 'Toetsen', filter: 'tests', path: 'test-history.html' },
      { key: 'skills', label: 'Skills', filter: 'skills', path: 'skills.html' }
    ]),
    makeGroup('planning', 'Planning', [
      { key: 'agenda', label: 'Agenda', filter: 'agenda', path: 'agenda.html' },
      { key: 'month-calendar', label: 'Maandkalender', filter: 'month-calendar', path: 'month-calendar.html' }
    ]),
    makeGroup('extra', 'Extra', [
      { key: 'challenges', label: 'Challenges', filter: 'challenges', path: 'challenge-settings.html' },
      { key: 'games', label: 'Spelletjes', filter: 'games', path: 'game-access.html' }
    ]),
    makeGroup('beheer', 'Beheer', [
      { key: 'archive', label: 'Archief', filter: 'archive', path: 'archive.html' },
      { key: 'trash', label: 'Prullenbak', filter: 'trash', path: 'archive.html' }
    ])
  ];
}

export function createPacoNavigationItem(item) {
  const group = document.createElement('div');
  group.className = 'paco-template-nav-group';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'paco-template-nav-item' + (item.active ? ' active' : '') + (item.kind === 'management-mode' ? ' management' : '');

  let iconElement = null;
  if (item.icon) {
    iconElement = document.createElement('span');
    iconElement.className = 'paco-template-nav-icon';
    iconElement.textContent = item.icon;
    button.appendChild(iconElement);
  }

  const label = document.createElement('span');
  label.textContent = item.label || '';
  button.appendChild(label);

  if (Array.isArray(item.submenu) && item.submenu.length) {
    const chevron = document.createElement('span');
    chevron.className = 'paco-template-nav-chevron';
    chevron.textContent = '›';
    button.appendChild(chevron);
    group.classList.add('always-open');
  }

  if (typeof item.onClick === 'function') button.addEventListener('click', item.onClick);
  group.appendChild(button);

  if (Array.isArray(item.submenu) && item.submenu.length) {
    const submenu = document.createElement('div');
    submenu.className = 'paco-template-nav-submenu';

    item.submenu.forEach(subitem => {
      const subbutton = document.createElement('button');
      subbutton.type = 'button';
      subbutton.className = 'paco-template-nav-subitem' + (subitem.active ? ' active' : '');
      subbutton.textContent = subitem.label || '';
      if (typeof subitem.onClick === 'function') subbutton.addEventListener('click', subitem.onClick);
      submenu.appendChild(subbutton);
    });

    group.appendChild(submenu);
  }

  if (typeof item.bind === 'function') item.bind({ button, label, icon: iconElement });

  return group;
}
