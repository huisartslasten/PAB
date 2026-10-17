/**
 * PacoGO shared shell navigation.
 *
 * The page template owns the visual navigation surface; this module owns the
 * shared PacoGO route map. Pages provide only context (active route/student)
 * and never define the navigation structure themselves.
 */

function go(path, student = '', parentStudent = '') {
  const target = new URL(path, window.location.href);
  if (student) target.searchParams.set('student', student);
  if (parentStudent) {
    target.searchParams.set('parentStudent', parentStudent);
    target.searchParams.set('context', 'management');
  }
  window.location.href = target.toString();
}

export function createPacoNavigation({
  active = '',
  activeSubmenu = '',
  student = '',
  parentStudent = '',
  managementStudents = [],
  onSelectManagementStudent = null,
  includeManagementStudentSelector = false,
  includeManagement = true,
  includeManagementTools = false,
  includeCreator = false,
  includeAgenda = true
} = {}) {
  const items = [];

  if (includeManagementStudentSelector) {
    items.push({
      key: 'management-student',
      label: 'LEERLING',
      submenu: managementStudents.map(name => ({
        key: `management-student-${name}`,
        label: name,
        active: name === parentStudent,
        onClick: () => {
          if (typeof onSelectManagementStudent === 'function') onSelectManagementStudent(name);
        }
      }))
    });
  }

  items.push(
    {
      key: 'dashboard',
      icon: '🏠',
      label: 'Dashboard',
      onClick: () => go('dashboard.html', student, parentStudent)
    },
    {
      key: 'lessons',
      icon: '📚',
      label: 'Mijn lessen',
      onClick: () => go('lessons.html', student, parentStudent)
    }
  );

  if (includeAgenda) {
    items.push({
      key: 'agenda',
      icon: '📅',
      label: 'Mijn agenda',
      onClick: () => go('agenda.html', student, parentStudent),
      submenu: [
        {
          key: 'agenda',
          label: 'Agenda invoeren',
          active: activeSubmenu === 'agenda',
          onClick: () => go('agenda.html', student, parentStudent)
        },
        {
          key: 'month-calendar',
          label: 'Maandkalender',
          active: activeSubmenu === 'month-calendar',
          onClick: () => go('month-calendar.html', student, parentStudent)
        }
      ]
    });
  }

  items.push({
    key: 'test-history',
    icon: '📝',
    label: 'Toetsen',
    onClick: () => go('test-history.html', student, parentStudent)
  });

  if (includeManagement) {
    items.push({
      key: 'management',
      icon: '⚙️',
      label: 'Beheer',
      onClick: () => go('management.html', '', parentStudent)
    });
  }

  if (includeManagementTools) {
    items.push({
      key: 'recovery',
      icon: '🗂️',
      label: 'Archief / Prullenbak',
      onClick: () => go('archive.html', '', parentStudent)
    });
    items.push({
      key: 'feedback',
      icon: '💬',
      label: 'Feedback',
      onClick: () => go('feedback.html', '', parentStudent)
    });
  }

  if (includeCreator) {
    items.push({
      key: 'creator',
      icon: '🧠',
      label: 'Creator Console',
      onClick: () => go('creator.html')
    });
  }

  return items.map(item => ({
    ...item,
    active: item.key === active
  }));
}
