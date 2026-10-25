import { listStudents } from '../features/students/students.js';
import { confirmPacoAction } from './confirm-dialog.js';
import { buildViewUrl } from '../core/view-context.js';

function currentPage() { return window.location.pathname.split('/').pop() || 'dashboard.html'; }
function go(navigate, path, { student = '', mode = 'student' } = {}) { if (typeof navigate !== 'function') throw new TypeError('PacoGO shared navigation requires the central navigation owner.'); return navigate(buildViewUrl(path, { student, mode })); }
function toggleManagement(navigate, { student = '', isManagementView = false } = {}) { return go(navigate, currentPage(), { student, mode: isManagementView ? 'student' : 'management' }); }
function requireNavigationApp(app, includeAccount) { if (!includeAccount) return; if (!app?.auth || !app?.authSession) throw new Error('createPacoNavigation requires the application context when includeAccount is enabled.'); }

export function createPacoNavigation({ app = null, active = '', activeSubmenu = '', student = '', viewMode = 'student', managementStudents = [], onSelectManagementStudent = null, includeManagementStudentSelector = false, includeManagementDashboard = false, includeManagementDashboardStudentSubmenu = true, includeManagement = true, includeManagementTools = false, includeCreator = false, includeLessons = true, includePractice = true, includeSkills = true, includeAgenda = true, includeAccount = true, hideActive = false, navigate } = {}) {
  requireNavigationApp(app, includeAccount);
  if (typeof navigate !== 'function') throw new TypeError('createPacoNavigation requires a navigation owner.');
  const view = { student, mode: viewMode };
  const isManagementView = viewMode === 'management';
  const showManagementLearnerBar = !isManagementView && includeManagementStudentSelector;
  const showManagementDashboard = !isManagementView && includeManagementDashboard;
  const showManagementTools = isManagementView || includeManagementTools;
  const showCreator = isManagementView || includeCreator;
  const learners = managementStudents.length ? managementStudents : listStudents();
  const items = [];

  if (isManagementView) {
    items.push({ key: 'management-mode', kind: 'management-mode', label: 'BEHEER', active: true, onClick: () => toggleManagement(navigate, { student, isManagementView: true }) });
    items.push({ key: 'management-student', kind: 'student-context', label: 'LEERLING', submenu: learners.map(name => ({ key: `management-student-${name}`, label: name, active: name === student, onClick: () => typeof onSelectManagementStudent === 'function' ? onSelectManagementStudent(name) : go(navigate, currentPage(), { student: name, mode: 'management' }) })) });
  } else if (includeManagement && app?.auth?.isParent) {
    items.push({ key: 'management-mode', kind: 'management-mode', label: 'BEHEER', onClick: () => toggleManagement(navigate, { student, isManagementView: false }) });
  } else if (showManagementLearnerBar) {
    items.push({ key: 'management-student', kind: 'student-context', label: 'LEERLING', submenu: learners.map(name => ({ key: `management-student-${name}`, label: name, active: name === student, onClick: () => typeof onSelectManagementStudent === 'function' ? onSelectManagementStudent(name) : go(navigate, currentPage(), { student: name, mode: 'student' }) })) });
  }

  items.push({ key: 'dashboard', icon: '🏠', label: 'Dashboard', onClick: () => go(navigate, isManagementView ? 'management.html' : 'dashboard.html', view), active: active === 'dashboard' });
  if (showManagementDashboard) items[items.length - 1] = { key: 'management-dashboard', icon: '🏠', label: 'Dashboard', onClick: () => go(navigate, 'management.html', view), active: active === 'management-dashboard', submenu: includeManagementDashboardStudentSubmenu ? learners.map(name => ({ key: `management-student-${name}`, label: name, active: name === student, onClick: () => typeof onSelectManagementStudent === 'function' ? onSelectManagementStudent(name) : go(navigate, 'management.html', { student: name, mode: 'management' }) })) : [] };
  if (includeLessons) items.push({ key: 'lessons', icon: '📚', label: isManagementView ? 'Vakken beheren' : 'Mijn vakken', onClick: () => go(navigate, 'lessons.html', view) });
  if (includeSkills && !isManagementView) items.push({ key: 'skills', icon: '⚡', label: 'Skills', onClick: () => go(navigate, 'skills.html', view) });
  if (includeAgenda) items.push({ key: 'agenda', icon: '📅', label: isManagementView ? 'Agenda beheren' : 'Mijn agenda', onClick: () => go(navigate, 'agenda.html', view), submenu: [
    { key: 'agenda', label: isManagementView ? 'Agenda beheren' : 'Agenda invoeren', active: activeSubmenu === 'agenda', onClick: () => go(navigate, 'agenda.html', view) },
    { key: 'month-calendar', label: 'Maandkalender', active: activeSubmenu === 'month-calendar', onClick: () => go(navigate, 'month-calendar.html', view) }
  ] });
  items.push({ key: 'test-history', icon: '📝', label: isManagementView ? 'Toetsgeschiedenis' : 'Toetsen', onClick: () => go(navigate, 'test-history.html', view) });
  if (showManagementTools) {
    items.push({ key: 'recovery', icon: '🗂️', label: 'Archief / Prullenbak', onClick: () => go(navigate, 'archive.html', view) });
    items.push({ key: 'feedback', icon: '💬', label: 'Feedback', onClick: () => go(navigate, 'feedback.html', view) });
  }
  if (showCreator) items.push({ key: 'creator', icon: '🧠', label: 'Creator Console', onClick: () => go(navigate, 'creator.html', view) });
  if (includeAccount) items.push({ key: 'account', icon: app.auth.isLoggedIn ? '🚪' : '🔐', label: app.auth.isLoggedIn ? 'Uitloggen' : 'Inloggen', onClick: async () => { if (!app.auth.isLoggedIn) { window.location.href = 'auth.html'; return; } const confirmed = await confirmPacoAction({ title: 'Uitloggen?', message: 'Weet je zeker dat je wilt uitloggen?', confirmLabel: 'Ja, uitloggen', cancelLabel: 'Nee' }); if (!confirmed) return; await app.authSession.signOut(); app.auth.setSession(null); window.location.href = 'auth.html'; }, bind: ({ label, icon }) => { const render = session => { const loggedIn = Boolean(session); label.textContent = loggedIn ? 'Uitloggen' : 'Inloggen'; icon.textContent = loggedIn ? '🚪' : '🔐'; }; render(app.auth.session); return app.auth.subscribe(render).unsubscribe; } });
  return items.filter(item => !(hideActive && item.key === active)).map(item => ({ ...item, active: item.active ?? item.key === active }));
}

export function createPacoManagementNavigation({ app, active = '', activeSubmenu = '', student = '', managementStudents = [], onSelectManagementStudent = null, navigate } = {}) {
  return createPacoNavigation({ app, active, activeSubmenu, student, viewMode: 'management', managementStudents, onSelectManagementStudent, includeManagementTools: true, includeCreator: true, includeLessons: true, includeSkills: false, includePractice: false, includeAgenda: true, includeAccount: true, navigate });
}
