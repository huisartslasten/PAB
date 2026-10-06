import test from 'node:test';
import assert from 'node:assert/strict';
import { moveCurrentLessonToTrash } from '../src/features/lessons/lesson-recovery-runtime.js';

test('trash runtime preserves V4.78 authorization, modal, write and refresh order', async () => {
  const calls = [];
  let lessonState = { id: 42, title: 'Les' };
  let subjectState = 'Nederlands';

  const result = await moveCurrentLessonToTrash({
    authorize: async () => { calls.push('authorize'); return true; },
    currentLesson: lessonState,
    currentSubject: subjectState,
    closeModal: () => calls.push('closeModal'),
    moveToTrash: async ({ lessonId }) => { calls.push(`write:${lessonId}`); },
    setCurrentLesson: value => { calls.push(`lesson:${value}`); lessonState = value; },
    loadLessons: async () => calls.push('loadLessons'),
    setCurrentSubject: value => { calls.push(`subject:${value}`); subjectState = value; },
    showSubject: async value => calls.push(`showSubject:${value}`),
    showMessage: (message, type) => calls.push(`message:${type}:${message}`)
  });

  assert.deepEqual(calls, [
    'authorize',
    'closeModal',
    'write:42',
    'lesson:null',
    'loadLessons',
    'subject:Nederlands',
    'showSubject:Nederlands',
    'message:success:Les naar de prullenbak verplaatst.'
  ]);
  assert.deepEqual(result, { ok: true, stage: 'complete', lessonId: 42, subject: 'Nederlands' });
  assert.equal(lessonState, null);
  assert.equal(subjectState, 'Nederlands');
});

test('authorization or missing current lesson closes the modal and stops before persistence', async () => {
  const calls = [];
  const result = await moveCurrentLessonToTrash({
    authorize: async () => { calls.push('authorize'); return false; },
    currentLesson: { id: 42 },
    currentSubject: 'Nederlands',
    closeModal: () => calls.push('closeModal'),
    moveToTrash: async () => { calls.push('write'); },
    setCurrentLesson: () => calls.push('lesson'),
    loadLessons: async () => calls.push('load'),
    setCurrentSubject: () => calls.push('subject'),
    showSubject: async () => calls.push('showSubject')
  });

  assert.deepEqual(calls, ['authorize', 'closeModal']);
  assert.deepEqual(result, { ok: false, stage: 'authorization' });
});

test('trash persistence failure preserves V4.78 error message and stops refresh', async () => {
  const calls = [];
  const error = new Error('database unavailable');
  const result = await moveCurrentLessonToTrash({
    authorize: async () => true,
    currentLesson: { id: 7 },
    currentSubject: 'Rekenen',
    closeModal: () => calls.push('closeModal'),
    moveToTrash: async () => { throw error; },
    setCurrentLesson: () => calls.push('lesson'),
    loadLessons: async () => calls.push('load'),
    setCurrentSubject: () => calls.push('subject'),
    showSubject: async () => calls.push('showSubject'),
    showMessage: (message, type) => calls.push(`${type}:${message}`)
  });

  assert.deepEqual(calls, [
    'closeModal',
    'error:Verwijderen mislukt: database unavailable'
  ]);
  assert.equal(result.ok, false);
  assert.equal(result.stage, 'persistence');
  assert.equal(result.error, error);
});

test('trash runtime rejects missing required boundaries explicitly', async () => {
  await assert.rejects(
    () => moveCurrentLessonToTrash({}),
    /A lesson recovery authorization function is required\./
  );
});
