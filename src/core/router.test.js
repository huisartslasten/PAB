import { describe, expect, it, vi } from 'vitest';
import { createPacoRouter } from './router.js';

function createWindow() {
  const listeners = new Map();
  const history = {
    pushState: vi.fn(),
    replaceState: vi.fn()
  };
  return {
    location: { href: 'https://example.test/dashboard.html?viewStudent=Zyon' },
    history,
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: (type, listener) => listeners.delete(type),
    dispatchPopState: () => listeners.get('popstate')?.()
  };
}

describe('createPacoRouter', () => {
  it('normalizes the current route without rendering it', () => {
    const windowRef = createWindow();
    const router = createPacoRouter({ windowRef });

    const route = router.getRoute();

    expect(route.path).toBe('dashboard.html');
    expect(route.params.get('viewStudent')).toBe('Zyon');
  });

  it('owns pushState navigation and emits the resulting route', () => {
    const windowRef = createWindow();
    const router = createPacoRouter({ windowRef });
    const listener = vi.fn();
    router.onChange(listener);

    router.navigate('lessons.html?viewStudent=Zenith');

    expect(windowRef.history.pushState).toHaveBeenCalledWith(
      {},
      '',
      'https://example.test/lessons.html?viewStudent=Zenith'
    );
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      path: 'lessons.html',
      popstate: false
    }));
  });

  it('reports browser back/forward changes through the same route contract', () => {
    const windowRef = createWindow();
    const router = createPacoRouter({ windowRef });
    const listener = vi.fn();
    router.onChange(listener);
    const stop = router.start();

    windowRef.dispatchPopState();

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      path: 'dashboard.html',
      popstate: true
    }));

    stop();
  });
});
