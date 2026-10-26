import { listStudents } from '../features/students/students.js';
import { confirmPacoAction } from './confirm-dialog.js';
import { buildViewUrl } from '../core/view-context.js';

function currentPage() { return window.location.pathname.split('/').pop() || 'dashboard.html'; }
function go(navigate, path, { student = '' } = {}) {
  if (typeof navigate !== 'function') throw new TypeError('PacoGO shared navigation requires the central navigation owner.');
  return navigate(buildViewUrl(path, { student }));
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
  if (includeManagementTools) {
    items.push({ key: 'recovery', icon: '🗂️', label: 'Archief / Prullenbak', onClick: () => go(navigate, 'archive.html', { student }) });
    items.push({ key: 'feedback', icon: '💬', label: 'Feedback', onClick: () => go(navigate, 'feedback.html', { student }) });
  }
  if (includeCreator) items.push({ key: 'creator', icon: '🧠', label: 'Creator Console', onClick: () => go(navigate, 'creator.html', { student }) });
  if (includeAccount) items.push({ key: 'account', icon: app.auth.isLoggedIn ? '🚪' : '🔐', label: app.auth.isLoggedIn ? 'Uitloggen' : 'Inloggen', onClick: async () => { if (!app.auth.isLoggedIn) { window.location.href = 'auth.html'; return; } const confirmed = await confirmPacoAction({ title: 'Uitloggen?', message: 'Weet je zeker dat je wilt uitloggen?', confirmLabel: 'Ja, uitloggen', cancelLabel: 'Nee' }); if (!confirmed) return; await app.authSession.signOut(); app.auth.setSession(null); window.location.href = 'auth.html'; }, bind: ({ label, icon }) => { const render = session => { const loggedIn = Boolean(session); label.textContent = loggedIn ? 'Uitloggen' : 'Inloggen'; icon.textContent = loggedIn ? '🚪' : '🔐'; }; render(app.auth.session); return app.auth.subscribe(render).unsubscribe; } });
  return items.filter(item => !(hideActive && item.key === active)).map(item => ({ ...item, active: item.active ?? item.key === active }));
}

export function createPacoManagementNavigation({ app, active = '', activeSubmenu = '', student = '', managementStudents = [], onSelectManagementStudent = null, navigate } = {}) {
  return createPacoNavigation({ app, active, activeSubmenu, student, managementStudents, onSelectManagementStudent, includeManagementDashboard: true, includeManagementTools: true, includeCreator: true, includeLessons: true, includeSkills: true, includePractice: false, includeAgenda: true, includeAccount: true, navigate });
}
