import assert from 'node:assert/strict';
import test from 'node:test';
import { createLessonFromPhotoRuntime } from '../src/features/lessons/lesson-photo-runtime.js';

function base(overrides = {}) {
  const events = [];
  const state = { student: null, subject: null, lesson: null };
  const deps = {
    authorize: async () => { events.push('authorize'); return true; },
    student: 'Zyon',
    subject: 'Themawoorden',
    title: 'Foto-les',
    type: 'words',
    pairs: [{ question: 'kat', answer: 'dier' }],
    persistLesson: async input => { events.push(['persist', input]); return { lesson: { id: 42 } }; },
    loadLessons: async () => events.push('load'),
    lessons: [{ id: 42, title: 'Foto-les' }],
    setCurrentStudent: value => { state.student = value; events.push(['student', value]); },
    setCurrentSubject: value => { state.subject = value; events.push(['subject', value]); },
    setCurrentLesson: value => { state.lesson = value; events.push(['lesson', value?.id ?? null]); },
    saveSourcePhoto: async (...args) => events.push(['source-photo', ...args]),
    shouldSaveSourcePhoto: false,
    sourcePhotoFile: null,
    showMessage: (...args) => events.push(['message', ...args]),
    showParentDashboard: async () => events.push('dashboard'),
    ...overrides
  };
  return { deps, events, state };
}

test('photo runtime preserves V4.78 success order and state resolution', async () => {
  const { deps, events, state } = base();
  const result = await createLessonFromPhotoRuntime(deps);
  assert.equal(result.ok, true);
  assert.deepEqual(events.map(event => Array.isArray(event) ? event[0] : event), [
    'authorize', 'persist', 'load', 'student', 'subject', 'lesson', 'message', 'dashboard'
  ]);
  assert.equal(state.student, 'Zyon');
  assert.equal(state.subject, 'Themawoorden');
  assert.equal(state.lesson.id, 42);
  assert.deepEqual(events[6], ['message', 'Les gemaakt uit de foto. Controleer hem gerust nog even.', 'success']);
});

test('photo runtime hard-stops on authorization failure', async () => {
  const { deps, events } = base({ authorize: async () => { events.push('authorize'); return false; } });
  const result = await createLessonFromPhotoRuntime(deps);
  assert.deepEqual(result, { ok: false, stage: 'authorization' });
  assert.deepEqual(events, ['authorize']);
});

test('photo runtime saves the source photo only when requested', async () => {
  const file = { name: 'werkblad.jpg' };
  const { deps, events } = base({ shouldSaveSourcePhoto: true, sourcePhotoFile: file });
  await createLessonFromPhotoRuntime(deps);
  assert.deepEqual(events[6], ['source-photo', 42, file]);
  assert.deepEqual(events[7], ['message', 'Les gemaakt uit de foto. Controleer hem gerust nog even.', 'success']);
  assert.equal(events[8], 'dashboard');
});

test('photo runtime keeps success flow after source-photo failure while reporting the exact error message', async () => {
  const { deps, events } = base({
    shouldSaveSourcePhoto: true,
    sourcePhotoFile: { name: 'werkblad.jpg' },
    saveSourcePhoto: async () => { throw new Error('storage failed'); }
  });
  await createLessonFromPhotoRuntime(deps);
  assert.deepEqual(events[6], ['message', 'Les is gemaakt, maar de bronfoto kon niet worden opgeslagen.', 'error']);
  assert.deepEqual(events[7], ['message', 'Les gemaakt uit de foto. Controleer hem gerust nog even.', 'success']);
  assert.equal(events[8], 'dashboard');
});
