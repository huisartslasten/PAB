import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonEditorRuntime } from '../src/features/lessons/lesson-editor-runtime-entry.js';

function createDb() {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push(['from', table]);
      if (table === 'lessons') {
        return {
          insert(payload) {
            calls.push(['insert-lesson', payload]);
            return { select: () => ({ single: async () => ({ data: { ...payload, id: 17 }, error: null }) }) };
          },
          delete() { return { eq: async () => ({ error: null }) }; }
        };
      }
      if (table === 'lesson_items') {
        return {
          insert(payload) { calls.push(['insert-items', payload]); return { select: async () => ({ data: payload, error: null }) }; }
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    }
  };
}

function createStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('lesson editor runtime authorizes parent, persists lesson and syncs test date', async () => {
  const db = createDb();
  const storage = createStorage();
  const runtime = createLessonEditorRuntime({ db, storage, initializeSession: async () => {}, isParent: () => true });

  const result = await runtime.save({
    lessonId: null,
    lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Week 4', type: 'words' },
    items: [{ question: 'Vraag', answer: 'Antwoord', sort_order: 0 }],
    testDate: '2026-10-20'
  });

  assert.equal(result.ok, true);
  assert.equal(result.lessonId, 17);
  assert.equal(JSON.parse(storage.getItem('pacogo_test_calendar'))[0].date, '2026-10-20');
  assert.equal(db.calls.some(([kind]) => kind === 'insert-items'), true);
});

test('lesson editor runtime stops before persistence when user is not a parent', async () => {
  const db = createDb();
  const storage = createStorage();
  const runtime = createLessonEditorRuntime({ db, storage, initializeSession: async () => {}, isParent: () => false });

  const result = await runtime.save({ lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Geen toegang', type: 'words' }, items: [] });

  assert.equal(result.ok, false);
  assert.equal(result.stage, 'authorization');
  assert.equal(db.calls.length, 0);
});
