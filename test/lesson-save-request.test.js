import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLessonSaveExecutionRequest } from '../src/features/lessons/lesson-save-request.js';

test('maps canonical save model to coordinator write contract', () => {
  const model = {
    lessonId: 42,
    lesson: {
      student: 'Zyon',
      subject: 'Nederlands',
      subvak: 'Themawoorden',
      title: 'Les',
      type: 'words'
    },
    items: [{ question: 'Vraag', answer: 'Antwoord', sort_order: 3 }],
    testDate: '2026-10-10'
  };

  const request = buildLessonSaveExecutionRequest(model);

  assert.deepEqual(request, {
    id: 42,
    lesson: model.lesson,
    items: model.items,
    testDate: '2026-10-10'
  });
});

test('preserves create semantics and does not mutate item payloads', () => {
  const item = { question: 'Vraag', answer: 'Antwoord' };
  const request = buildLessonSaveExecutionRequest({
    lessonId: null,
    lesson: { student: 'Zyon', subject: 'Rekenen' },
    items: [item]
  });

  assert.equal(request.id, null);
  assert.notEqual(request.items[0], item);
  assert.deepEqual(request.items[0], item);
  assert.equal(request.testDate, '');
});

test('rejects a missing save model', () => {
  assert.throws(
    () => buildLessonSaveExecutionRequest(),
    /A lesson save model is required\./
  );
});
