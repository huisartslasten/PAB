import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonWriteService } from '../src/features/lessons/lesson-write-service.js';

function mockLessonService() {
  const calls = [];
  return {
    calls,
    async createLessonWithItems(payload) {
      calls.push({ method: 'createLessonWithItems', payload });
      return {
        lesson: { id: 41, title: payload.lesson.title },
        items: payload.items
      };
    },
    async updateLesson(id, payload) {
      calls.push({ method: 'updateLesson', id, payload });
      return { id, ...payload };
    },
    async replaceLessonItems(id, items) {
      calls.push({ method: 'replaceLessonItems', id, items });
      return items;
    }
  };
}

test('lesson write service requires the canonical lesson service instead of a database client', () => {
  assert.throws(
    () => createLessonWriteService({ from() {} }),
    /canonical lesson service is required/
  );
});

test('lesson write service maps editor data and delegates creation to canonical lesson service', async () => {
  const lessons = mockLessonService();
  const service = createLessonWriteService(lessons);

  const result = await service.saveLesson({
    lesson: {
      student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden', title: 'Nieuwe les', type: 'words',
      explanation: 'Uitleg', ai_check_answers: true, ai_instruction: 'Betekenis beoordelen', editor_labels: null
    },
    items: [{ question: 'Vraag', answer: 'Antwoord' }]
  });

  assert.deepEqual(result, {
    lesson: { id: 41, title: 'Nieuwe les' },
    items: [{ question: 'Vraag', answer: 'Antwoord' }]
  });
  assert.deepEqual(lessons.calls, [{
    method: 'createLessonWithItems',
    payload: {
      lesson: {
        student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden', title: 'Nieuwe les', type: 'words',
        explanation: 'Uitleg', ai_check_answers: true, ai_instruction: 'Betekenis beoordelen', editor_labels: null
      },
      items: [{ question: 'Vraag', answer: 'Antwoord' }]
    }
  }]);
});

test('lesson write service delegates update and item replacement in order', async () => {
  const lessons = mockLessonService();
  const service = createLessonWriteService(lessons);

  const result = await service.saveLesson({
    id: 17,
    lesson: { student: 'Zyon', subject: 'Rekenen', subvak: '', title: 'Aangepaste les', type: 'math' },
    items: [{ question: 'Vraag', answer: 'Antwoord' }]
  });

  assert.deepEqual(result, {
    lesson: {
      id: 17,
      student: 'Zyon', subject: 'Rekenen', subvak: '', title: 'Aangepaste les', type: 'math',
      explanation: '', ai_check_answers: false, ai_instruction: '', editor_labels: null
    },
    items: [{ question: 'Vraag', answer: 'Antwoord' }]
  });
  assert.deepEqual(lessons.calls.map(call => call.method), ['updateLesson', 'replaceLessonItems']);
});

test('lesson write service normalizes subvak before delegating the mutation', async () => {
  const lessons = mockLessonService();
  const service = createLessonWriteService(lessons);

  const result = await service.updateLessonSubvak(17, '  Themawoorden  ');

  assert.deepEqual(result, {
    id: 17,
    subvak: 'Themawoorden'
  });
  assert.deepEqual(lessons.calls, [{
    method: 'updateLesson',
    id: 17,
    payload: { subvak: 'Themawoorden' }
  }]);
});
