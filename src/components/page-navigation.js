/**
 * PacoGO shared shell navigation.
 *
 * The page template owns the visual navigation surface; this module owns the
 * shared PacoGO route map. Pages provide only context (active route/student)
 * and never define the navigation structure themselves.
 */

function go(path, student = '') {
  const target = new URL(path, window.location.href);
  if (student) target.searchParams.set('student', student);
  window.location.href = target.toString();
}

export function createPacoNavigation({
  active = '',
  activeSubmenu = '',
  student = '',
  includeManagement = true,
  includeCreator = false,
  includeAgenda = true
} = {}) {
  const items = [
    {
      key: 'dashboard',
      icon: '🏠',
      label: 'Dashboard',
      onClick: () => go('dashboard.html', student)
    },
    {
      key: 'lessons',
      icon: '📚',
      label: 'Mijn lessen',
      onClick: () => go('lessons.html', student)
    }
  ];

  if (includeAgenda) {
    items.push({
      key: 'agenda',
      icon: '📅',
      label: 'Mijn agenda',
      onClick: () => go('agenda.html', student),
      submenu: [
        {
          key: 'agenda',
          label: 'Agenda invoeren',
          active: activeSubmenu === 'agenda',
          onClick: () => go('agenda.html', student)
        },
        {
          key: 'month-calendar',
          label: 'Maandkalender',
          active: activeSubmenu === 'month-calendar',
          onClick: () => go('month-calendar.html', student)
        }
      ]
    });
  }

  items.push({
    key: 'test-history',
    icon: '📝',
    label: 'Toetsen',
    onClick: () => go('test-history.html', student)
  });

  if (includeManagement) {
    items.push({
      key: 'management',
      icon: '⚙️',
      label: 'Beheer',
      onClick: () => go('management.html')
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
