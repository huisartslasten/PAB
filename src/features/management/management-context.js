import { listStudents } from '../../core/student-registry.js';
import { buildViewUrl } from '../../core/view-context.js';
import { confirmPacoAction } from '../../components/confirm-dialog.js';

/**
 * Canonical management context actions shared by management pages.
 *
 * The management context owns dashboard navigation, learner switching,
 * learner-perspective entry and logout. Individual feature runtimes own only
 * their page content and domain behavior.
 */
export function createManagementTopbar({ app, student = '', managementFilter = 'dashboard', navigate } = {}) {
  if (!app) throw new TypeError('Management topbar requires app.');
  if (typeof navigate !== 'function') throw new TypeError('Management topbar requires navigation owner.');

  async function logout() {
    if (!app.auth?.isLoggedIn) {
      window.location.href = 'auth.html';
      return;
    }
    const confirmed = await confirmPacoAction({
      title: 'Uitloggen?',
      message: 'Weet je zeker dat je wilt uitloggen?',
      confirmLabel: 'Ja, uitloggen',
      cancelLabel: 'Nee'
    });
    if (!confirmed) return;
    await app.authSession.signOut();
    app.auth.setSession(null);
    window.location.href = 'auth.html';
  }

  function goDashboard() {
    navigate(buildViewUrl('management.html', {
      student,
      mode: 'management',
      managementFilter: 'dashboard'
    }));
  }

  function viewSelectedStudent() {
    if (!student) return;
    navigate(buildViewUrl('dashboard.html', { student, mode: 'student' }));
  }

  return Object.freeze({
    onDashboard: goDashboard,
    dashboardActive: managementFilter === 'dashboard',
    students: listStudents().map(name => ({
      label: name,
      active: name === student,
      onClick: () => navigate(buildViewUrl('management.html', { student: name, managementFilter }))
    })),
    canViewStudent: Boolean(student),
    onViewStudent: viewSelectedStudent,
    onLogout: logout
  });
}
