import { listStudents } from '../features/students/students.js';

/**
 * PacoGO shared shell navigation.
 *
 * This module owns the shared route map and the account entry shown in the
 * shared sidebar. Pages provide only route/view information and the shared
 * application context; they do not decide whether the user is logged in.
 */

function go(path, { student = '', mode = 'student' } = {}) {
  const target = new URL(path, window.location.href);
  if (student) target.searchParams.set('viewStudent', student);
  if (mode === 'management' && student) target.searchParams.set('mode', 'management');
  window.location.href = target.toString();
}

function requireNavigationApp(app, includeAccount) {
  if (!includeAccount) return;
  if (!app?.auth || !app?.authSession) {
    throw new Error('createPacoNavigation requires the application context when includeAccount is enabled.');
  }
}

export function createPacoNavigation({
  app = null,
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
  includePractice = true,
  includeAgenda = true,
  includeAccount = true,
  hideActive = false
} = {}) {
  requireNavigationApp(app, includeAccount);

  const view = { student, mode: viewMode };
  const isManagementView = viewMode === 'management';
  const showManagementLearnerBar = isManagementView || includeManagementStudentSelector;
  const showManagementDashboard = isManagementView || includeManagementDashboard;
  const learners = managementStudents.length ? managementStudents : listStudents();
  const items = [];

  if (showManagementLearnerBar) {
    items.push({
      key: 'management-student',
      label: 'LEERLING',
      submenu: learners.map(name => ({
        key: `management-student-${name}`,
        label: name,
        active: name === student,
        onClick: () => {
          if (typeof onSelectManagementStudent === 'function') {
            onSelectManagementStudent(name);
          } else {
            go(window.location.pathname.split('/').pop() || 'dashboard.html', { student: name, mode: 'management' });
          }
        }
      }))
    });
  }

  if (showManagementDashboard) {
    items.push({
      key: 'management-dashboard',
      icon: '🏠',
      label: 'Beheer dashboard',
      onClick: () => go('management.html', view)
    });
  }

  if (!showManagementLearnerBar && !showManagementDashboard) {
    items.push({ key: 'dashboard', icon: '🏠', label: 'Dashboard', onClick: () => go('dashboard.html', view) });
  }

  if (includeLessons) {
    items.push({
      key: 'lessons',
      icon: '📚',
      label: isManagementView ? 'Lessen beheren' : 'Mijn lessen',
      onClick: () => go('lessons.html', view)
    });
  }

  if (includePractice && !isManagementView) {
    items.push({ key: 'practice', icon: '✏️', label: 'Oefenen', onClick: () => go('oefenen.html', view) });
  }

  if (includeAgenda) {
    items.push({
      key: 'agenda',
      icon: '📅',
      label: isManagementView ? 'Agenda beheren' : 'Mijn agenda',
      onClick: () => go('agenda.html', view),
      submenu: [
        { key: 'agenda', label: isManagementView ? 'Agenda beheren' : 'Agenda invoeren', active: activeSubmenu === 'agenda', onClick: () => go('agenda.html', view) },
        { key: 'month-calendar', label: 'Maandkalender', active: activeSubmenu === 'month-calendar', onClick: () => go('month-calendar.html', view) }
      ]
    });
  }

  items.push({ key: 'test-history', icon: '📝', label: 'Toetsen', onClick: () => go('test-history.html', view) });

  if (includeManagement && !isManagementView) items.push({ key: 'management', icon: '⚙️', label: 'Beheer', onClick: () => go('management.html', view) });
  if (includeManagementTools) {
    items.push({ key: 'recovery', icon: '🗂️', label: 'Archief / Prullenbak', onClick: () => go('archive.html', view) });
    items.push({ key: 'feedback', icon: '💬', label: 'Feedback', onClick: () => go('feedback.html', view) });
  }
  if (includeCreator) items.push({ key: 'creator', icon: '🧠', label: 'Creator Console', onClick: () => go('creator.html', view) });

  if (includeAccount) {
    const accountItem = {
      key: 'account',
      icon: app.auth.isLoggedIn ? '🚪' : '🔐',
      label: app.auth.isLoggedIn ? 'Uitloggen' : 'Inloggen',
      onClick: async () => {
        if (!app.auth.isLoggedIn) {
          go('auth.html');
          return;
        }
        await app.authSession.signOut();
        app.auth.setSession(null);
        window.location.href = 'auth.html';
      },
      bind: ({ label, icon }) => {
        const render = session => {
          const loggedIn = Boolean(session);
          label.textContent = loggedIn ? 'Uitloggen' : 'Inloggen';
          icon.textContent = loggedIn ? '🚪' : '🔐';
        };
        render(app.auth.session);
        return app.auth.subscribe(render).unsubscribe;
      }
    };
    items.push(accountItem);
  }

  return items
    .filter(item => !(hideActive && item.key === active))
    .map(item => ({ ...item, active: item.key === active }));
}
