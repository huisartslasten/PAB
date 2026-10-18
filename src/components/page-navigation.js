/**
 * PacoGO shared shell navigation.
 *
 * This module owns the shared route map and serializes the canonical student
 * view context. Pages provide only active-route and view-context information.
 */

function go(path, { student = '', mode = 'student' } = {}) {
  const target = new URL(path, window.location.href);
  if (student) target.searchParams.set('viewStudent', student);
  if (mode === 'management' && student) target.searchParams.set('mode', 'management');
  window.location.href = target.toString();
}

export function createPacoNavigation({
  active = '',
  activeSubmenu = '',
  student = '',
  viewMode = 'student',
  managementStudents = [],
  onSelectManagementStudent = null,
  includeManagementStudentSelector = false,
  includeManagementDashboard = false,
  includeManagement = true,
  includeManagementTools = false,
  includeCreator = false,
  includeLessons = true,
  includeAgenda = true,
  includeAccount = true,
  hideActive = false
} = {}) {
  const view = { student, mode: viewMode };
  const items = [];

  if (includeManagementStudentSelector) {
    items.push({
      key: 'management-student',
      label: 'LEERLING',
      submenu: managementStudents.map(name => ({
        key: `management-student-${name}`,
        label: name,
        active: name === student,
        onClick: () => {
          if (typeof onSelectManagementStudent === 'function') onSelectManagementStudent(name);
        }
      }))
    });
  }

  if (includeManagementDashboard) {
    items.push({ key: 'management-dashboard', icon: '🏠', label: 'Dashboard', onClick: () => go('management.html') });
  }

  // Beheer has its own dashboard/start context. The dashboard entry here is
  // the learner dashboard and would incorrectly leave the management context.
  if (!includeManagementStudentSelector && !includeManagementDashboard) {
    items.push({ key: 'dashboard', icon: '🏠', label: 'Dashboard', onClick: () => go('dashboard.html', view) });
  }

  // The management dashboard is a distinct navigation context. It does not
  // expose student-owned "Mijn lessen" or "Mijn agenda" entry points; those
  // remain available throughout the canonical student environment.
  const includeStudentNavigation = !includeManagementStudentSelector && !includeManagementDashboard;

  if (includeLessons && includeStudentNavigation) {
    items.push({ key: 'lessons', icon: '📚', label: 'Mijn lessen', onClick: () => go('lessons.html', view) });
  }

  if (includeAgenda && includeStudentNavigation) {
    items.push({
      key: 'agenda', icon: '📅', label: 'Mijn agenda', onClick: () => go('agenda.html', view),
      submenu: [
        { key: 'agenda', label: 'Agenda invoeren', active: activeSubmenu === 'agenda', onClick: () => go('agenda.html', view) },
        { key: 'month-calendar', label: 'Maandkalender', active: activeSubmenu === 'month-calendar', onClick: () => go('month-calendar.html', view) }
      ]
    });
  }

  items.push({ key: 'test-history', icon: '📝', label: 'Toetsen', onClick: () => go('test-history.html', view) });

  if (includeManagement) items.push({ key: 'management', icon: '⚙️', label: 'Beheer', onClick: () => go('management.html') });
  if (includeManagementTools) {
    items.push({ key: 'recovery', icon: '🗂️', label: 'Archief / Prullenbak', onClick: () => go('archive.html') });
    items.push({ key: 'feedback', icon: '💬', label: 'Feedback', onClick: () => go('feedback.html') });
  }
  if (includeCreator) items.push({ key: 'creator', icon: '🧠', label: 'Creator Console', onClick: () => go('creator.html') });
  if (includeAccount) items.push({ key: 'account', icon: '🔐', label: 'Inloggen / Uitloggen', onClick: () => go('auth.html') });

  return items
    .filter(item => !(hideActive && item.key === active))
    .map(item => ({ ...item, active: item.key === active }));
}
