import test from 'node:test';
import assert from 'node:assert/strict';
import { createPacoGOApp } from '../src/app/bootstrap.js';
import { appState, setViewContext } from '../src/core/state.js';
import { PARENT_IDS } from '../src/core/auth-authorization.js';

function makeStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  };
}

function makeSupabaseLib(session = null) {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false, deleted: false, lesson_items: [] }
  ];

  const db = {
    auth: {
      getSession: async () => ({ data: { session }, error: null })
    },
    functions: {
      invoke: async () => ({ data: { correct: true, feedback: '' }, error: null })
    },
    from() {
      return {
        select() {
          return {
            order: async () => ({ data: lessons.map(item => ({ ...item })), error: null })
          };
        }
      };
    },
    rpc: async () => ({ data: [], error: null }),
    storage: {
      from() {
        return {};
      }
    }
  };

  return {
    createClient() {
      return db;
    }
  };
}

test('application root composes management with canonical lesson, feedback, grading, audio and auth services', async () => {
  setViewContext('', 'student');
  appState.lessons = [];

  const app = createPacoGOApp({
    supabaseLib: makeSupabaseLib(),
    session: { user: { id: PARENT_IDS[0] } },
    storage: makeStorage()
  });

  assert.ok(app.lessons);
  assert.ok(app.feedback);
  assert.ok(app.grading);
  assert.ok(app.audio);
  assert.ok(app.authSession);
  assert.ok(app.management);
  assert.ok(app.lessonOrder);
  assert.equal(app.management.listFeedback instanceof Function, true);
  assert.equal(app.loadLessons instanceof Function, true);
  assert.strictEqual(app.state, appState);

  const loaded = await app.loadLessons();
  assert.deepEqual(loaded.map(item => item.id), [1]);
  assert.deepEqual(appState.lessons.map(item => item.id), [1]);

  setViewContext('Zyon', 'management');
  const scoped = await app.management.loadLessons();

  assert.deepEqual(scoped.map(item => item.id), [1]);
  assert.deepEqual(appState.lessons.map(item => item.id), [1]);
});

test('application root initializes the current session through the auth service boundary', async () => {
  setViewContext('', 'student');
  const session = { user: { id: PARENT_IDS[0] } };
  const app = createPacoGOApp({
    supabaseLib: makeSupabaseLib(session),
    session: null,
    storage: makeStorage()
  });

  assert.equal(app.auth.isParent, false);
  const currentSession = await app.initializeSession();

  assert.deepEqual(currentSession, session);
  assert.equal(app.auth.isParent, true);
  setViewContext('Zyon', 'management');
  const scoped = await app.management.loadLessons();
  assert.deepEqual(scoped.map(item => item.id), [1]);
});

test('application root exposes management before parent authorization is granted', async () => {
  setViewContext('Zyon', 'management');
  const app = createPacoGOApp({
    supabaseLib: makeSupabaseLib(),
    session: null,
    storage: makeStorage()
  });

  assert.ok(app.management);
  await assert.rejects(() => app.management.loadLessons(), /parent session/);
});