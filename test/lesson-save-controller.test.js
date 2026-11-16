import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonSaveController } from '../src/features/lessons/save-controller.js';

function fakeService() {
  const calls = [];
  return {
    calls,
    async createLesson(payload) { calls.push(['createLesson', payload]); return { id: 42, ...payload }; },
    async updateLesson(id, payload) { calls.push(['updateLesson', id, payload]); return { id, ...payload }; },
    async replaceLessonItems(id, items) { calls.push(['replaceLessonItems', id, items]); return items; }
  };
}

test('new lesson follows V4.78 create then item replacement order', async () => {
  const service = fakeService();
  let refreshed = false;
  const controller = createLessonSaveController({ lessonService: service, refresh: async () => { refreshed = true; } });
  const result = await controller.save({ student: 'Zyon', subject: 'Nederlands', title: 'Woorden', type: 'words', items: [{ question: 'boom', answer: 'tree' }] });
  assert.equal(result.lesson.id, 42);
  assert.deepEqual(service.calls.map(c => c[0]), ['createLesson', 'replaceLessonItems']);
  assert.equal(service.calls[1][1], 42);
  assert.equal(refreshed, true);
});

test('existing lesson updates header before replacing items', async () => {
  const service = fakeService();
  const controller = createLessonSaveController({ lessonService: service });
  await controller.save({ id: 9, student: 'Zyon', subject: 'Rekenen', title: 'Breuken', type: 'questions', items: [{ question: '1+1', answer: '2' }] });
  assert.deepEqual(service.calls.map(c => c[0]), ['updateLesson', 'replaceLessonItems']);
  assert.equal(service.calls[1][1], 9);
});

test('invalid lesson is rejected before database calls', async () => {
  const service = fakeService();
  const controller = createLessonSaveController({ lessonService: service });
  await assert.rejects(() => controller.save({ student: '', subject: 'Nederlands', title: 'Les', items: [] }), /Invalid lesson draft/);
  assert.deepEqual(service.calls, []);
});
