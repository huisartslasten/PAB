import { describe, expect, it } from 'vitest';
import { createPacoNavigation, createPacoManagementNavigation, createPacoNavigationItem } from './page-navigation.js';

function createApp({ isParent = false } = {}) {
  return {
    auth: {
      isParent,
      isLoggedIn: true,
      session: {},
      subscribe: () => ({ unsubscribe() {} })
    },
    authSession: { signOut: async () => {} },
    managementCapabilities: {
      getAvailableForPage: ({ page, student }) => page === 'management' && isParent && student ? [{}] : []
    }
  };
}

describe('shared PacoGO navigation', () => {
  it('does not expose OEFENEN in the learner navigation', () => {
    const items = createPacoNavigation({
      app: createApp({ isParent: true }),
      navigate: () => {}
    });

    expect(items.some(item => item.key === 'practice')).toBe(false);
    expect(items.some(item => item.label === 'Oefenen')).toBe(false);
  });

  it('exposes Beheer in learner navigation only when the management engine grants access', () => {
    const parentItems = createPacoNavigation({
      app: createApp({ isParent: true }),
      student: 'Zyon',
      navigate: () => {}
    });
    const learnerItems = createPacoNavigation({
      app: createApp({ isParent: false }),
      student: 'Zyon',
      navigate: () => {}
    });

    expect(parentItems.some(item => item.key === 'management' && item.label === 'Beheer')).toBe(true);
    expect(learnerItems.some(item => item.key === 'management')).toBe(false);
  });

  it('does not expose a management mode control in normal navigation', () => {
    const items = createPacoNavigation({
      app: createApp({ isParent: true }),
      student: 'Zyon',
      navigate: () => {}
    });

    expect(items.some(item => item.key === 'management-mode')).toBe(false);
    expect(items.some(item => item.label === 'BEHEER')).toBe(false);
  });

  it('provides the central management dashboard with the full learner selector', () => {
    const items = createPacoManagementNavigation({
      app: createApp({ isParent: true }),
      student: 'Zyon',
      managementStudents: ['Zyon', 'Mila'],
      navigate: () => {}
    });

    const dashboard = items.find(item => item.key === 'management-dashboard');
    expect(dashboard.label).toBe('Dashboard');
    expect(dashboard.submenu.map(item => item.label)).toEqual(['Zyon', 'Mila']);
    expect(dashboard.submenu.find(item => item.label === 'Zyon').active).toBe(true);
  });

  it('renders central management tools explicitly without switching navigation mode', () => {
    const items = createPacoNavigation({
      app: createApp({ isParent: true }),
      student: 'Zyon',
      includeManagement: false,
      includeManagementDashboard: true,
      includeManagementTools: true,
      includeCreator: true,
      managementStudents: ['Zyon', 'Mila'],
      navigate: () => {}
    });

    expect(items.map(item => item.key)).toEqual([
      'management-dashboard',
      'lessons',
      'skills',
      'agenda',
      'test-history',
      'recovery',
      'feedback',
      'creator',
      'account'
    ]);

    const dashboard = items.find(item => item.key === 'management-dashboard');
    expect(dashboard.label).toBe('Dashboard');
    expect(dashboard.submenu.map(item => item.label)).toEqual(['Zyon', 'Mila']);
    expect(dashboard.submenu.find(item => item.label === 'Zyon').active).toBe(true);
    expect(items.some(item => item.key === 'management-mode')).toBe(false);
    expect(items.some(item => item.key === 'management-student-heading')).toBe(false);
    expect(items.some(item => item.label === 'Kies leerling')).toBe(false);
    expect(items.some(item => item.key === 'practice')).toBe(false);
  });

  it('owns navigation item rendering centrally', () => {
    const root = createPacoNavigationItem({
      key: 'agenda',
      label: 'Mijn agenda',
      icon: '📅',
      active: true,
      submenu: [{ key: 'agenda', label: 'Agenda invoeren', active: true }]
    });

    expect(root.className).toBe('paco-template-nav-group always-open');
    expect(root.querySelector('.paco-template-nav-item').textContent).toContain('Mijn agenda');
    expect(root.querySelector('.paco-template-nav-item').classList.contains('active')).toBe(true);
    expect(root.querySelector('.paco-template-nav-subitem').textContent).toBe('Agenda invoeren');
    expect(root.querySelector('.paco-template-nav-subitem').classList.contains('active')).toBe(true);
  });
});
