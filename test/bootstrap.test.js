import test from 'node:test';
import assert from 'node:assert/strict';
import { createPacoGOApp } from '../src/app/bootstrap.js';
import { appState } from '../src/core/state.js';
import { PARENT_IDS } from '../src/core/auth.js';

function makeSupabaseLib(session = null) {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false, deleted: false, lesson_items: [] }
  ];

  const db = {
    auth: {
      getSession: async () => ({ data: { session }, error: null })
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

test('application root composes management with canonical lesson, feedback and auth services', async () => {
  appState.currentStudent = null;
  appState.lessons = [];

  const app = createPacoGOApp({
    supabaseLib: makeSupabaseLib(),
    session: { user: { id: PARENT_IDS[0] } }
  });

  assert.ok(app.lessons);
  assert.ok(app.feedback);
  assert.ok(app.authSession);
  assert.ok(app.management);
  assert.equal(app.management.listFeedback instanceof Function, true);
  assert.strictEqual(app.state, appState);

  app.management.selectStudent('Zyon');
  const lessons = await app.management.loadLessons();

  assert.deepEqual(lessons.map(item => item.id), [1]);
  assert.deepEqual(appState.lessons.map(item => item.id), [1]);
});

test('application root initializes the current session through the auth service boundary', async () => {
  const session = { user: { id: PARENT_IDS[0] } };
  const app = createPacoGOApp({
    supabaseLib: makeSupabaseLib(session),
    session: null
  });

  assert.equal(app.auth.isParent, false);
  const currentSession = await app.initializeSession();

  assert.deepEqual(currentSession, session);
  assert.equal(app.auth.isParent, true);
  app.management.selectStudent('Zyon');
});

test('application root exposes management before parent authorization is granted', () => {
  const app = createPacoGOApp({
    supabaseLib: makeSupabaseLib(),
    session: null
  });

  assert.ok(app.management);
  assert.throws(() => app.management.selectStudent('Zyon'), /parent session/);
});
