import test from 'node:test';
import assert from 'node:assert/strict';
import { createPacoGOApp } from '../src/app/bootstrap.js';
import { appState } from '../src/core/state.js';

function makeSupabaseLib() {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false, deleted: false, lesson_items: [] }
  ];

  const db = {
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

test('application root composes management with the canonical lesson service and state', async () => {
  appState.currentStudent = null;
  appState.lessons = [];

  const app = createPacoGOApp({
    supabaseLib: makeSupabaseLib(),
    session: { user: { id: '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09' } }
  });

  assert.ok(app.lessons);
  assert.ok(app.management);
  assert.strictEqual(app.state, appState);

  app.management.selectStudent('Zyon');
  const lessons = await app.management.loadLessons();

  assert.deepEqual(lessons.map(item => item.id), [1]);
  assert.deepEqual(appState.lessons.map(item => item.id), [1]);
});

test('application root exposes management before parent authorization is granted', () => {
  const app = createPacoGOApp({
    supabaseLib: makeSupabaseLib(),
    session: null
  });

  assert.ok(app.management);
  assert.throws(() => app.management.selectStudent('Zyon'), /parent session/);
});
