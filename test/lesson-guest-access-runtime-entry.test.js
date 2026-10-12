import test from 'node:test';
import assert from 'node:assert/strict';
import { executeSetGuestLessonAccess, installLessonGuestAccessRuntimeEntry, loadGuestLessonAccess } from '../src/features/lessons/lesson-guest-access-runtime-entry.js';

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
          if (table === 'guest_access') return { data: { id: 7 }, error: null };
          return { data: null, error: null };
        },
        insert(value) { calls.push(['insert', value]); return Promise.resolve({ error: null }); }
      };
      return chain;
    }
  };
}

function createGuestReadDb() {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push(['from', table]);
      const chain = {
        select(value) { calls.push(['select', value]); return chain; },
        eq(field, value) {
          calls.push(['eq', field, value]);
          if (table === 'guest_access') return chain;
          return Promise.resolve({ data: [{ id: 11, lesson_id: 12, active: true }], error: null });
        },
        maybeSingle: async () => {
          calls.push(['maybeSingle']);
          return { data: { id: 7 }, error: null };
        }
      };
      return chain;
    }
  };
}

test('entry requires the guest runtime boundary', async () => {
  await assert.rejects(
    executeSetGuestLessonAccess({}, 12, true),
    /guest-lesson runtime boundary is missing: requireParent/
  );
});

test('entry delegates the runtime contract and returns completion', async () => {
  const { value, calls } = runtime();
  const db = createGuestDb();
  const result = await executeSetGuestLessonAccess({ ...value, db }, 12, true);
  assert.equal(result.ok, true);
  assert.equal(result.stage, 'complete');
  assert.equal(result.guestId, 7);
  assert.deepEqual(calls, ['render', ['message', 'Les geactiveerd.', 'success']]);
  assert.deepEqual(db.calls.slice(-1), [['insert', { guest_id: 7, lesson_id: 12, active: true }]]);
});

test('entry reads guest access through the canonical runtime boundary', async () => {
  const { value } = runtime();
  const db = createGuestReadDb();
  const result = await loadGuestLessonAccess({ ...value, db }, 'Zyon');
  assert.deepEqual(result, {
    guest: { id: 7 },
    assignments: [{ id: 11, lesson_id: 12, active: true }]
  });
  assert.deepEqual(db.calls, [
    ['from', 'guest_access'],
    ['select', 'id'],
    ['eq', 'guest_name', 'Zyon'],
    ['maybeSingle'],
    ['from', 'guest_lessons'],
    ['select', 'id,lesson_id,active'],
    ['eq', 'guest_id', 7]
  ]);
});

test('entry installs the guest access runtime globals', async () => {
  const { value } = runtime();
  const target = {};
  const installed = installLessonGuestAccessRuntimeEntry(value, target);
  assert.equal(typeof target.setGuestLesson, 'function');
  assert.equal(typeof target.pacoGOLoadGuestLessonAccess, 'function');
  assert.equal(installed.setGuestLesson, target.setGuestLesson);
  assert.equal(installed.loadGuestLessonAccess, target.pacoGOLoadGuestLessonAccess);
});
