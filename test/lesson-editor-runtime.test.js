import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonEditorApplication } from '../src/features/lessons/lesson-editor-application.js';

function createDb() {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push(['from', table]);
      if (table === 'lessons') return { insert(payload) { calls.push(['insert-lesson', payload]); return { select: () => ({ single: async () => ({ data: { ...payload, id: 17 }, error: null }) }) }; }, delete() { return { eq: async () => ({ error: null }) }; } };
      throw new Error(`Unexpected table: ${table}`);
    }
  };
}

function createStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('lesson editor application composes canonical write ownership and test-calendar sync', async () => {
  const db = createDb();
  const storage = createStorage();
  const application = createLessonEditorApplication({ db, storage, initializeSession: async () => {}, isParent: () => true });

  const result = await application.saveDraft({ lessonId: null, lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Week 4', type: 'words' }, items: [], testDate: '2026-10-20' });

  assert.equal(result.ok, true);
  assert.equal(result.lessonId, 17);
  assert.equal(JSON.parse(storage.getItem('pacogo_test_calendar'))[0].date, '2026-10-20');
  assert.equal(db.calls.some(([kind]) => kind === 'insert-lesson'), true);
});

test('lesson editor application blocks persistence for non-parent users', async () => {
  const db = createDb();
  const storage = createStorage();
  const application = createLessonEditorApplication({ db, storage, initializeSession: async () => {}, isParent: () => false });

  const result = await application.saveDraft({ lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Geen toegang', type: 'words' }, items: [] });

  assert.equal(result.ok, false);
  assert.equal(result.stage, 'authorization');
  assert.equal(db.calls.length, 0);
});
