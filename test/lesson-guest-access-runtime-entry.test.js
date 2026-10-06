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

function createGuestDb() {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push(['from', table]);
      const chain = {
        select(value) { calls.push(['select', value]); return chain; },
        eq(field, value) { calls.push(['eq', field, value]); return chain; },
        maybeSingle: async () => {
          calls.push(['maybeSingle']);
          if (table === 'guest_users') return { data: { id: 7 }, error: null };
          return { data: null, error: null };
        },
        insert(value) { calls.push(['insert', value]); return Promise.resolve({ error: null }); }
      };
      return chain;
    }
  };
}

test('entry requires the guest runtime bridge', async () => {
  await assert.rejects(
    executeSetGuestLessonAccess({}, 12, true),
    /guest-lesson runtime bridge is missing: requireParent/
  );
});

test('entry delegates the runtime contract and returns completion', async () => {
  const { value, calls } = runtime();
  const db = createGuestDb();
  const result = await executeSetGuestLessonAccess({ ...value, db }, 12, true);
  assert.equal(result.ok, true);
  assert.equal(result.stage, 'complete');
  assert.equal(result.guestId, 7);
  assert.deepEqual(calls, [['message', 'Les geactiveerd.', 'success']]);
  assert.deepEqual(db.calls.slice(-1), [['insert', { guest_id: 7, lesson_id: 12, active: true }]]);
});

test('entry installs the setGuestLesson global facade', async () => {
  const { value } = runtime();
  const target = {};
  const installed = installLessonGuestAccessRuntimeEntry(value, target);
  assert.equal(typeof target.setGuestLesson, 'function');
  assert.equal(installed.setGuestLesson, target.setGuestLesson);
});
