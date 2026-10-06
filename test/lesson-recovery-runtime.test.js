import test from 'node:test';
import assert from 'node:assert/strict';
import {
  moveCurrentLessonToTrash,
  archiveCurrentLesson,
  restoreArchivedLesson,
  restoreDeletedLesson
} from '../src/features/lessons/lesson-recovery-runtime.js';

test('trash runtime preserves V4.78 authorization, modal, write and refresh order', async () => {
  const calls = [];
  let lessonState = { id: 42, title: 'Les' };
  let subjectState = 'Nederlands';
  const result = await moveCurrentLessonToTrash({
    authorize: async () => { calls.push('authorize'); return true; }, currentLesson: lessonState, currentSubject: subjectState,
    closeModal: () => calls.push('closeModal'), moveToTrash: async ({ lessonId }) => calls.push(`write:${lessonId}`),
    setCurrentLesson: value => { calls.push(`lesson:${value}`); lessonState = value; }, loadLessons: async () => calls.push('loadLessons'),
    setCurrentSubject: value => { calls.push(`subject:${value}`); subjectState = value; }, showSubject: async value => calls.push(`showSubject:${value}`),
    showMessage: (message, type) => calls.push(`message:${type}:${message}`)
  });
  assert.deepEqual(calls, ['authorize','closeModal','write:42','lesson:null','loadLessons','subject:Nederlands','showSubject:Nederlands','message:success:Les naar de prullenbak verplaatst.']);
  assert.deepEqual(result, { ok: true, stage: 'complete', lessonId: 42, subject: 'Nederlands' });
  assert.equal(lessonState, null); assert.equal(subjectState, 'Nederlands');
});

test('authorization or missing current lesson closes the modal and stops before persistence', async () => {
  const calls = [];
  const result = await moveCurrentLessonToTrash({ authorize: async () => { calls.push('authorize'); return false; }, currentLesson: { id: 42 }, currentSubject: 'Nederlands', closeModal: () => calls.push('closeModal'), moveToTrash: async () => calls.push('write'), setCurrentLesson: () => calls.push('lesson'), loadLessons: async () => calls.push('load'), setCurrentSubject: () => calls.push('subject'), showSubject: async () => calls.push('showSubject') });
  assert.deepEqual(calls, ['authorize','closeModal']); assert.deepEqual(result, { ok: false, stage: 'authorization' });
});

test('trash persistence failure preserves V4.78 error message and stops refresh', async () => {
  const calls = [], error = new Error('database unavailable');
  const result = await moveCurrentLessonToTrash({ authorize: async () => true, currentLesson: { id: 7 }, currentSubject: 'Rekenen', closeModal: () => calls.push('closeModal'), moveToTrash: async () => { throw error; }, setCurrentLesson: () => calls.push('lesson'), loadLessons: async () => calls.push('load'), setCurrentSubject: () => calls.push('subject'), showSubject: async () => calls.push('showSubject'), showMessage: (message, type) => calls.push(`${type}:${message}`) });
  assert.deepEqual(calls, ['closeModal','error:Verwijderen mislukt: database unavailable']); assert.equal(result.ok, false); assert.equal(result.stage, 'persistence'); assert.equal(result.error, error);
});

test('trash runtime rejects missing required boundaries explicitly', async () => {
  await assert.rejects(() => moveCurrentLessonToTrash({}), /A lesson recovery authorization function is required\./);
});

test('archive runtime preserves V4.78 modal, write, reload, subject and dashboard order', async () => {
  const calls = [];
  const result = await archiveCurrentLesson({
    authorize: async () => { calls.push('authorize'); return true; }, currentLesson: { id: 9 }, currentSubject: 'Rekenen',
    closeModal: () => calls.push('closeModal'), archiveLesson: async ({ lessonId }) => calls.push(`write:${lessonId}`),
    setCurrentLesson: value => calls.push(`lesson:${value}`), loadLessons: async () => calls.push('load'), setCurrentSubject: value => calls.push(`subject:${value}`),
    showParentDashboard: async () => calls.push('dashboard'), showMessage: (message, type) => calls.push(`${type}:${message}`)
  });
  assert.deepEqual(calls, ['authorize','closeModal','write:9','lesson:null','load','subject:Rekenen','dashboard','success:Les gearchiveerd.']);
  assert.deepEqual(result, { ok: true, stage: 'complete', lessonId: 9, subject: 'Rekenen' });
});

test('archive runtime stops on persistence failure with exact V4.78 message', async () => {
  const calls = [], error = new Error('archive failed');
  const result = await archiveCurrentLesson({ authorize: async () => true, currentLesson: { id: 9 }, currentSubject: 'Rekenen', closeModal: () => calls.push('close'), archiveLesson: async () => { throw error; }, setCurrentLesson: () => calls.push('lesson'), loadLessons: async () => calls.push('load'), setCurrentSubject: () => calls.push('subject'), showParentDashboard: async () => calls.push('dashboard'), showMessage: (message, type) => calls.push(`${type}:${message}`) });
  assert.deepEqual(calls, ['close','error:Archiveren mislukt: archive failed']); assert.equal(result.stage, 'persistence'); assert.equal(result.error, error);
});

test('archived restore normalizes id and preserves V4.78 reload, student and dashboard order', async () => {
  const calls = [];
  const result = await restoreArchivedLesson({ authorize: async () => { calls.push('authorize'); return true; }, lessonId: '12', restoreLesson: async ({ lessonId }) => calls.push(`write:${lessonId}:${typeof lessonId}`), loadLessons: async () => calls.push('load'), setCurrentStudent: value => calls.push(`student:${value}`), parentSelectedStudent: 'Zyon', renderParentDashboard: async () => calls.push('dashboard'), showMessage: (message, type) => calls.push(`${type}:${message}`) });
  assert.deepEqual(calls, ['authorize','write:12:number','load','student:Zyon','dashboard','success:Les teruggezet.']);
  assert.deepEqual(result, { ok: true, stage: 'complete', lessonId: 12, student: 'Zyon' });
});

test('trash restore normalizes id and preserves V4.78 reload and success message', async () => {
  const calls = [];
  const result = await restoreDeletedLesson({ authorize: async () => { calls.push('authorize'); return true; }, lessonId: '13', restoreLesson: async ({ lessonId }) => calls.push(`write:${lessonId}:${typeof lessonId}`), loadLessons: async () => calls.push('load'), showMessage: (message, type) => calls.push(`${type}:${message}`) });
  assert.deepEqual(calls, ['authorize','write:13:number','load','success:Les uit de prullenbak hersteld.']);
  assert.deepEqual(result, { ok: true, stage: 'complete', lessonId: 13 });
});

test('restore authorization stops before persistence', async () => {
  const calls = [];
  const result = await restoreDeletedLesson({ authorize: async () => { calls.push('authorize'); return false; }, lessonId: 13, restoreLesson: async () => calls.push('write'), loadLessons: async () => calls.push('load') });
  assert.deepEqual(calls, ['authorize']); assert.deepEqual(result, { ok: false, stage: 'authorization' });
});
