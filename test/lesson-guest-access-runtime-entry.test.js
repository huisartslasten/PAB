import test from 'node:test';
import assert from 'node:assert/strict';
import { executeSetGuestLessonAccess, installLessonGuestAccessRuntimeEntry } from '../src/features/lessons/lesson-guest-access-runtime-entry.js';

function runtime(overrides = {}) {
  const calls = [];
  const value = {
    requireParent: async () => true,
    currentStudent: 'Zyon',
    db: {},
    renderParentStudent: async () => { calls.push('render'); },
    showMessage: (...args) => calls.push(['message', ...args]),
    ...overrides
  };
  return { value, calls };
}

test('entry requires the guest runtime bridge', async () => {
  await assert.rejects(
    executeSetGuestLessonAccess({}, 12, true),
    /guest-lesson runtime bridge is missing: requireParent/
  );
});

test('entry delegates the runtime contract and returns completion', async () => {
  const { value, calls } = runtime();
  const result = await executeSetGuestLessonAccess({
    ...value,
    db: {
      from(table) {
        assert.equal(table, 'guest_users');
        return {
          select() { return this; },
          eq() { return this; },
          maybeSingle: async () => ({ data: { id: 7 }, error: null })
        };
      }
    }
  }, 12, true);
  assert.equal(result.ok, true);
  assert.equal(result.stage, 'complete');
  assert.equal(result.guestId, 7);
  assert.deepEqual(calls, [['message', 'Les geactiveerd.', 'success']]);
});

test('entry installs the setGuestLesson global facade', async () => {
  const { value } = runtime();
  const target = {};
  const installed = installLessonGuestAccessRuntimeEntry(value, target);
  assert.equal(typeof target.setGuestLesson, 'function');
  assert.equal(installed.setGuestLesson, target.setGuestLesson);
});
