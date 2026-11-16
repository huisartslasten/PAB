import test from 'node:test';
import assert from 'node:assert/strict';
import { installPacoTemplateSidebarScrollChaining } from '../src/components/page-template.js';

function createHarness({ scrollTop, scrollHeight = 500, clientHeight = 400, scrollY = 100, pageHeight = 1000 } = {}) {
  const listeners = new Map();
  const navigationElement = {
    scrollTop,
    scrollHeight,
    clientHeight,
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    removeEventListener(type, handler) {
      if (listeners.get(type) === handler) listeners.delete(type);
    }
  };

  const windowRef = {
    scrollY,
    innerHeight: 800,
    scrollByCalls: [],
    scrollBy(x, y) {
      this.scrollByCalls.push([x, y]);
    },
    ["__pacoGOTemplateSidebarScrollCleanup"]: null
  };

  const documentRef = {
    documentElement: {
      scrollHeight: pageHeight
    }
  };

  const cleanup = installPacoTemplateSidebarScrollChaining({
    navigationElement,
    windowRef,
    documentRef
  });

  return {
    navigationElement,
    windowRef,
    handler: listeners.get('wheel'),
    cleanup
  };
}

test('transfers downward wheel delta immediately when sidebar is at bottom', () => {
  const { windowRef, handler, cleanup } = createHarness({ scrollTop: 100 });
  const event = { deltaY: 120, ctrlKey: false, defaultPrevented: false, preventDefault() { this.prevented = true; } };

  handler(event);

  assert.equal(event.prevented, true);
  assert.deepEqual(windowRef.scrollByCalls, [[0, 120]]);
  cleanup();
});

test('keeps wheel event inside sidebar while sidebar can still scroll', () => {
  const { windowRef, handler, cleanup } = createHarness({ scrollTop: 50 });
  const event = { deltaY: 120, ctrlKey: false, defaultPrevented: false, preventDefault() { this.prevented = true; } };

  handler(event);

  assert.equal(event.prevented, undefined);
  assert.deepEqual(windowRef.scrollByCalls, []);
  cleanup();
});

test('transfers upward wheel delta immediately when sidebar is at top', () => {
  const { windowRef, handler, cleanup } = createHarness({ scrollTop: 0 });
  const event = { deltaY: -80, ctrlKey: false, defaultPrevented: false, preventDefault() { this.prevented = true; } };

  handler(event);

  assert.equal(event.prevented, true);
  assert.deepEqual(windowRef.scrollByCalls, [[0, -80]]);
  cleanup();
});
