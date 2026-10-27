import { describe, expect, it } from 'vitest';
import { createPacoNavigation } from './page-navigation.js';

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
});
