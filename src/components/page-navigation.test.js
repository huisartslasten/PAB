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
    authSession: { signOut: async () => {} }
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

  it('exposes the management mode control to management users in the learner view', () => {
    const items = createPacoNavigation({
      app: createApp({ isParent: true }),
      student: 'Zyon',
      navigate: () => {}
    });

    const management = items.find(item => item.key === 'management-mode');
    expect(management).toBeDefined();
    expect(management.label).toBe('BEHEER');
    expect(management.kind).toBe('management-mode');
  });

  it('builds one central management context with Dashboard, learner selection and no OEFENEN entry', () => {
    const items = createPacoNavigation({
      app: createApp({ isParent: true }),
      student: 'Zyon',
      viewMode: 'management',
      managementStudents: ['Zyon', 'Mila'],
      navigate: () => {}
    });

    expect(items.map(item => item.key)).toEqual([
      'management-mode',
      'management-student-heading',
      'management-student',
      'dashboard',
      'lessons',
      'agenda',
      'test-history',
      'recovery',
      'feedback',
      'creator',
      'account'
    ]);
    expect(items.find(item => item.key === 'management-student').submenu.map(item => item.label)).toEqual(['Zyon', 'Mila']);
    expect(items.some(item => item.key === 'practice')).toBe(false);
  });
});
