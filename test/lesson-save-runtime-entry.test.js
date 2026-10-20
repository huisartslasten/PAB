import test from 'node:test';
import assert from 'node:assert/strict';
import { installLessonSaveRuntimeEntry } from '../src/features/lessons/lesson-save-runtime-entry.js';

function createValidRuntime(overrides = {}) {
  return {
    currentSubject: 'Nederlands',
    currentStudent: 'Testleerling',
    currentLesson: { id: 7 },
    document: {},
    getCurrentLessonDraft: () => ({ title: 'Les' }),
    collectItems: () => [],
    validateLessonDraft: () => ({ valid: true }),
    lessonService: {
      createLesson: async () => ({ id: 7 }),
      updateLesson: async () => ({ id: 7 }),
      replaceLessonItems: async () => []
    },
    isParent: () => true,
    showMessage: () => {},
    refreshLessons: async () => {},
    syncTestCalendar: async () => {},
    ...overrides
  };
}

test('runtime entry installs the canonical saveLesson function on the explicit target', () => {
  const target = { saveLesson: async () => 'previous' };
  const installed = installLessonSaveRuntimeEntry(createValidRuntime(), target);

  assert.strictEqual(installed, target.saveLesson);
  assert.equal(target.saveLesson.name, 'saveLessonRuntimeEntry');
  assert.equal(typeof target.pacoGOUpdateLessonSubvak, 'function');
});

test('runtime entry installation does not preserve a legacy saveLesson rollback path', () => {
  const target = { saveLesson: function legacySaveLesson() {} };
  const previous = target.saveLesson;
  const installed = installLessonSaveRuntimeEntry(createValidRuntime(), target);

  assert.strictEqual(installed, target.saveLesson);
  assert.notStrictEqual(target.saveLesson, previous);
  assert.equal(target.saveLesson.name, 'saveLessonRuntimeEntry');
});

test('runtime entry installation rejects an incomplete bridge before replacing the target saveLesson', () => {
  const legacySaveLesson = function legacySaveLesson() {};
  const target = { saveLesson: legacySaveLesson };
  assert.throws(
    () => installLessonSaveRuntimeEntry({ document: {} }, target),
    /Missing V4\.78 runtime bridge dependency: currentSubject/
  );
  assert.strictEqual(target.saveLesson, legacySaveLesson);
});

// The remaining runtime-entry contract tests live below this boundary.

test('runtime entry stops at authorization before reading or preparing an unauthorized save', async () => {
  const calls = [];
  const target = {};
  const runtime = createValidRuntime({
    isParent: () => false,
    getCurrentLessonDraft: () => { calls.push('draft'); return {}; },
    collectItems: () => { calls.push('items'); return []; },
    showMessage: () => calls.push('message')
  });
  installLessonSaveRuntimeEntry(runtime, target);
  await target.saveLesson();
  assert.deepEqual(calls, ['message']);
});

test('authorized runtime validates before any lesson service write or post-persistence effect', async () => {
  const calls = [];
  const target = {};
  const runtime = createValidRuntime({
    validateLessonDraft: () => { calls.push('validate'); return { valid: true }; },
    lessonService: {
      createLesson: async () => { calls.push('create'); return { id: 7 }; },
      updateLesson: async () => { calls.push('update'); return { id: 7 }; },
      replaceLessonItems: async () => { calls.push('items'); return []; }
    },
    refreshLessons: async () => calls.push('refresh'),
    syncTestCalendar: async () => calls.push('calendar')
  });
  installLessonSaveRuntimeEntry(runtime, target);
  await target.saveLesson();
  assert.equal(calls[0], 'validate');
  assert.ok(calls.includes('create'));
});

test('runtime entry rejects direct module execution without the explicit V4.78 bridge', () => {
  assert.throws(() => installLessonSaveRuntimeEntry(), /V4\.78 runtime bridge/);
});

test('runtime subvak update authorizes before delegating to the canonical lesson service', async () => {
  const calls = [];
  const target = {};
  const runtime = createValidRuntime({
    lessonService: {
      updateLessonSubvak: async (...args) => { calls.push(args); return { id: 7 }; }
    }
  });
  installLessonSaveRuntimeEntry(runtime, target);
  await target.pacoGOUpdateLessonSubvak(7, 'Spelling');
  assert.deepEqual(calls, [[7, 'Spelling']]);
});
