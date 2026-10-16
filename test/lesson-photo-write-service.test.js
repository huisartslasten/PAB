import assert from 'node:assert/strict';
import test from 'node:test';
import { createLessonFromPhotoPersistence } from '../src/features/lessons/lesson-photo-write-service.js';

function makeLessonService({ createError = null, insertError = null } = {}) {
  const calls = [];
  return {
    calls,
    async createLessonWithItems({ lesson, items }) {
      calls.push(['createLessonWithItems', { lesson, items }]);
      if (createError) throw createError;
      if (insertError) throw insertError;
      return {
        lesson: { id: 42, ...lesson },
        items: items.map((item, index) => ({
          id: index + 1,
          lesson_id: 42,
          ...item,
          hint: '',
          min_words: 0,
          required_terms: []
        }))
      };
    }
  };
}

test('photo persistence delegates lesson creation and ordered items to the canonical lesson service', async () => {
  const lessonService = makeLessonService();
  const result = await createLessonFromPhotoPersistence({
    lessonService,
    lesson: { student: 'Zyon', subject: 'Themawoorden', title: 'Foto-les', type: 'words' },
    items: [
      { question: 'kat', answer: 'dier' },
      { question: 'boom', answer: 'plant' }
    ]
  });

  assert.equal(result.lesson.id, 42);
  assert.deepEqual(lessonService.calls, [[
    'createLessonWithItems',
    {
      lesson: { student: 'Zyon', subject: 'Themawoorden', title: 'Foto-les', type: 'words' },
      items: [
        { question: 'kat', answer: 'dier', sort_order: 0 },
        { question: 'boom', answer: 'plant', sort_order: 1 }
      ]
    }
  ]]);
});

test('photo persistence propagates canonical lesson-service creation errors', async () => {
  const error = new Error('lesson creation failed');
  const lessonService = makeLessonService({ createError: error });

  await assert.rejects(
    createLessonFromPhotoPersistence({
      lessonService,
      lesson: { student: 'Zyon', subject: 'Rekenen', title: 'Foto', type: 'math' },
      items: [{ question: '1+1', answer: '2' }]
    }),
    failure => failure === error
  );
});

test('photo persistence propagates canonical lesson-service item errors', async () => {
  const error = new Error('item insert failed');
  const lessonService = makeLessonService({ insertError: error });

  await assert.rejects(
    createLessonFromPhotoPersistence({
      lessonService,
      lesson: { student: 'Zyon', subject: 'Rekenen', title: 'Foto', type: 'math' },
      items: [{ question: '1+1', answer: '2' }]
    }),
    failure => failure === error
  );
});

test('photo persistence rejects incomplete input before invoking the lesson service', async () => {
  let calls = 0;
  const lessonService = {
    createLessonWithItems() {
      calls += 1;
      throw new Error('should not be called');
    }
  };

  await assert.rejects(
    createLessonFromPhotoPersistence({
      lessonService,
      lesson: { student: 'Zyon', subject: 'Rekenen', title: 'Foto', type: 'math' },
      items: []
    }),
    /at least one pair/
  );
  assert.equal(calls, 0);
});

test('photo persistence requires the canonical lesson service', async () => {
  await assert.rejects(
    createLessonFromPhotoPersistence({
      lesson: { student: 'Zyon', subject: 'Rekenen', title: 'Foto', type: 'math' },
      items: [{ question: '1+1', answer: '2' }]
    }),
    /lesson service is required/
  );
});
