import test from 'node:test';
import assert from 'node:assert/strict';
import { setGuestLessonAccess } from '../src/features/lessons/lesson-guest-access-runtime.js';

test('guest lesson activation preserves V4.78 lookup, write, render and message order', async () => {
  const calls = [];
  const result = await setGuestLessonAccess({
    authorize: async () => { calls.push('authorize'); return true; },
    currentStudent: 'Gast',
    lessonId: 12,
    active: true,
    findGuest: async ({ guestName }) => { calls.push(`guest:${guestName}`); return { id: 4 }; },
    findAssignment: async ({ guestId, lessonId }) => { calls.push(`assignment:${guestId}:${lessonId}`); return null; },
    updateAssignment: async () => calls.push('update'),
    createAssignment: async ({ guestId, lessonId, active }) => calls.push(`create:${guestId}:${lessonId}:${active}`),
    renderParentStudent: async () => calls.push('render'),
    showMessage: (message, type) => calls.push(`message:${type}:${message}`)
  });
  assert.deepEqual(calls, ['authorize','guest:Gast','assignment:4:12','create:4:12:true','render','message:success:Les geactiveerd.']);
  assert.deepEqual(result, { ok: true, stage: 'complete', lessonId: 12, active: true, guestId: 4, assignmentId: null });
});

test('existing guest lesson assignment is updated and is not duplicated', async () => {
  const calls = [];
  const result = await setGuestLessonAccess({
    authorize: async () => true,
    currentStudent: 'Gast',
    lessonId: 8,
    active: false,
    findGuest: async () => ({ id: 3 }),
    findAssignment: async () => ({ id: 91 }),
    updateAssignment: async ({ assignmentId, active }) => calls.push(`update:${assignmentId}:${active}`),
    createAssignment: async () => calls.push('create'),
    renderParentStudent: async () => calls.push('render'),
    showMessage: (message, type) => calls.push(`message:${type}:${message}`)
  });
  assert.deepEqual(calls, ['update:91:false','render','message:success:Les gedeactiveerd.']);
  assert.deepEqual(result, { ok: true, stage: 'complete', lessonId: 8, active: false, guestId: 3, assignmentId: 91 });
});

test('authorization stops guest lookup and persistence', async () => {
  const calls = [];
  const result = await setGuestLessonAccess({
    authorize: async () => { calls.push('authorize'); return false; },
    currentStudent: 'Gast',
    lessonId: 2,
    active: true,
    findGuest: async () => calls.push('guest'),
    findAssignment: async () => calls.push('assignment'),
    updateAssignment: async () => calls.push('update'),
    createAssignment: async () => calls.push('create'),
    renderParentStudent: async () => calls.push('render')
  });
  assert.deepEqual(calls, ['authorize']);
  assert.deepEqual(result, { ok: false, stage: 'authorization' });
});

test('missing guest preserves the exact V4.78 error message and stops before assignment writes', async () => {
  const calls = [];
  const result = await setGuestLessonAccess({
    authorize: async () => true,
    currentStudent: 'Onbekend',
    lessonId: 2,
    active: true,
    findGuest: async () => null,
    findAssignment: async () => calls.push('assignment'),
    updateAssignment: async () => calls.push('update'),
    createAssignment: async () => calls.push('create'),
    renderParentStudent: async () => calls.push('render'),
    showMessage: (message, type) => calls.push(`message:${type}:${message}`)
  });
  assert.deepEqual(calls, ['message:error:Gastleerling kon niet worden gevonden.']);
  assert.deepEqual(result, { ok: false, stage: 'guest-not-found' });
});

test('inactive access with no existing assignment performs no insert but still refreshes', async () => {
  const calls = [];
  await setGuestLessonAccess({
    authorize: async () => true,
    currentStudent: 'Gast',
    lessonId: 5,
    active: false,
    findGuest: async () => ({ id: 2 }),
    findAssignment: async () => null,
    updateAssignment: async () => calls.push('update'),
    createAssignment: async () => calls.push('create'),
    renderParentStudent: async () => calls.push('render'),
    showMessage: (message, type) => calls.push(`message:${type}:${message}`)
  });
  assert.deepEqual(calls, ['render','message:success:Les gedeactiveerd.']);
});

test('guest access runtime rejects missing required boundaries explicitly', async () => {
  await assert.rejects(() => setGuestLessonAccess({}), /A guest-lesson authorization function is required\./);
});
