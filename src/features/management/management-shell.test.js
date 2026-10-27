import { describe, expect, it, vi } from 'vitest';

const mountPacoPageTemplate = vi.fn();
const createPacoNavigation = vi.fn(() => []);
const buildViewUrl = vi.fn(() => 'management.html');

vi.mock('../../components/page-template.js', () => ({ mountPacoPageTemplate }));
vi.mock('../../components/page-navigation.js', () => ({ createPacoNavigation }));
vi.mock('../../core/view-context.js', () => ({ buildViewUrl }));

import { createManagementShell } from './management-shell.js';

describe('management shell', () => {
  it('owns session, management navigation and canonical page-template mounting', async () => {
    const navigate = vi.fn();
    const app = {
      auth: { isParent: true },
      initializeSession: vi.fn(async () => ({ user: 'parent' }))
    };

    const shell = createManagementShell({
      app,
      templateMount: {},
      navigate,
      documentRef: {}
    });

    const result = await shell.mount({
      active: 'feedback',
      title: 'Feedback',
      icon: '💬',
      subtitle: 'Bekijk feedback.',
      content: {}
    });

    expect(result).toEqual({ authorized: true });
    expect(app.initializeSession).toHaveBeenCalledOnce();
    expect(createPacoNavigation).toHaveBeenCalledWith(expect.objectContaining({
      app,
      active: 'feedback',
      viewMode: 'management',
      navigate
    }));
    expect(mountPacoPageTemplate).toHaveBeenCalledWith(expect.objectContaining({
      mount: {},
      greeting: 'PacoGO beheer ⚙️',
      title: 'Feedback',
      icon: '💬'
    }));
  });

  it('returns forbidden after mounting the management shell for non-parent sessions', async () => {
    const app = {
      auth: { isParent: false },
      initializeSession: vi.fn(async () => ({ user: 'learner' }))
    };

    const shell = createManagementShell({
      app,
      templateMount: {},
      navigate: vi.fn(),
      documentRef: {}
    });

    await expect(shell.mount({ title: 'Feedback' })).resolves.toEqual({
      authorized: false,
      reason: 'forbidden'
    });
  });
});
