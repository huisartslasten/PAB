import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonEditorApplication } from '../src/features/lessons/lesson-editor-application.js';

function createLessonService() {
  const calls = [];
  return {
    calls,
    async createLessonWithItems({ lesson, items }) {
      calls.push(['createLessonWithItems', { lesson, items }]);
      return { lesson: { ...lesson, id: 17 }, items };
    },
    async updateLesson(id, payload) {
      calls.push(['updateLesson', id, payload]);
      return { id, ...payload };
    },
    async replaceLessonItems(id, items) {
      calls.push(['replaceLessonItems', id, items]);
      return items;
    }
  };
}

function createStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('lesson editor application composes canonical write ownership and test-calendar sync', async () => {
  const lessonService = createLessonService();
  const storage = createStorage();
  const application = createLessonEditorApplication({ lessonService, storage, initializeSession: async () => {}, isParent: () => true });

  const result = await application.saveDraft({ lessonId: null, lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Week 4', type: 'words' }, items: [], testDate: '2026-10-20' });

  assert.equal(result.ok, true);
  assert.equal(result.lessonId, 17);
  assert.equal(JSON.parse(storage.getItem('pacogo_test_calendar'))[0].date, '2026-10-20');
  assert.equal(lessonService.calls[0][0], 'createLessonWithItems');
});

test('lesson editor application blocks persistence for non-parent users', async () => {
  const lessonService = createLessonService();
  const storage = createStorage();
  const application = createLessonEditorApplication({ lessonService, storage, initializeSession: async () => {}, isParent: () => false });

  const result = await application.saveDraft({ lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Geen toegang', type: 'words' }, items: [] });

  assert.equal(result.ok, false);
  assert.equal(result.stage, 'authorization');
  assert.equal(lessonService.calls.length, 0);
});