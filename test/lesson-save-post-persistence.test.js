import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLessonSavePostPersistence } from '../src/features/lessons/lesson-save-post-persistence.js';

test('preserves V4.78 current subject and clears current lesson after reload', () => {
  assert.deepEqual(resolveLessonSavePostPersistence({
    lessons: [{ id: 42, subject: 'Nederlands', title: 'Dictee' }],
    lessonId: 42,
    subject: 'Nederlands',
    testDate: '2026-11-12'
  }), {
    currentSubject: 'Nederlands',
    currentLesson: null,
    savedLesson: { id: 42, subject: 'Nederlands', title: 'Dictee' },
    testCalendarAction: 'upsert',
    successMessage: 'Les opgeslagen en toetsdatum toegevoegd.'
  });
});

test('selects removal and the plain success message when no test date exists', () => {
  assert.deepEqual(resolveLessonSavePostPersistence({
    lessons: [{ id: 42, subject: 'Nederlands', title: 'Dictee' }],
    lessonId: '42',
    subject: 'Nederlands',
    testDate: ''
  }), {
    currentSubject: 'Nederlands',
    currentLesson: null,
    savedLesson: { id: 42, subject: 'Nederlands', title: 'Dictee' },
    testCalendarAction: 'remove',
    successMessage: 'Les opgeslagen.'
  });
});

test('skips calendar mutation when the reloaded lesson cannot be found', () => {
  assert.deepEqual(resolveLessonSavePostPersistence({
    lessons: [{ id: 99, subject: 'Nederlands', title: 'Andere les' }],
    lessonId: 42,
    subject: 'Nederlands',
    testDate: '2026-11-12'
  }), {
    currentSubject: 'Nederlands',
    currentLesson: null,
    savedLesson: null,
    testCalendarAction: 'none',
    successMessage: 'Les opgeslagen en toetsdatum toegevoegd.'
  });
});

test('uses the plain success message even when no saved lesson is found and no date was supplied', () => {
  assert.equal(resolveLessonSavePostPersistence({
    lessons: [],
    lessonId: 42,
    subject: 'Nederlands',
    testDate: ''
  }).successMessage, 'Les opgeslagen.');
});
