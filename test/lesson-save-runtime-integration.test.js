import test from 'node:test';
import assert from 'node:assert/strict';
import { executeLessonSaveApplication } from '../src/features/lessons/lesson-save-runtime-integration.js';

test('application adapter preserves the complete successful runtime contract', async () => {
  const calls = [];
  let coordinatorInput;

  const result = await executeLessonSaveApplication({
    authorize: async () => { calls.push('authorize'); return true; },
    readDraft: async () => { calls.push('readDraft'); return { lessonId: 7, testDate: '2026-10-12' }; },
    prepare: async ({ draft }) => {
      calls.push('prepare');
      return { draft: { ...draft, lesson: { student: 'Zyon', subject: 'Rekenen', title: 'Plus' } }, items: [{ question: '1+1', answer: '2' }] };
    },
    executeCoordinator: async input => {
      calls.push('coordinator');
      coordinatorInput = input;
      return { ok: true, stage: 'complete', outcome: { currentSubject: 'Rekenen' } };
    },
    onComplete: async value => { calls.push(`complete:${value.stage}`); }
  });

  assert.deepEqual(calls, ['authorize', 'readDraft', 'prepare', 'coordinator', 'complete:complete']);
  assert.equal(coordinatorInput.draft.lessonId, 7);
  assert.equal(coordinatorInput.draft.testDate, '2026-10-12');
  assert.deepEqual(await coordinatorInput.collectItems(), [{ question: '1+1', answer: '2' }]);
  assert.equal(result.ok, true);
});

test('authorization failure remains a hard stop at the application boundary', async () => {
  const calls = [];
  const result = await executeLessonSaveApplication({
    authorize: async () => { calls.push('authorize'); return false; },
    readDraft: async () => { calls.push('readDraft'); },
    prepare: async () => { calls.push('prepare'); },
    executeCoordinator: async () => { calls.push('coordinator'); }
  });

  assert.deepEqual(calls, ['authorize']);
  assert.deepEqual(result, { ok: false, stage: 'authorization' });
});

test('validation and persistence failures reach only their matching application handlers', async () => {
  const validationCalls = [];
  const validation = await executeLessonSaveApplication({
    authorize: async () => true,
    readDraft: async () => ({}),
    prepare: async () => ({ draft: {}, items: [] }),
    executeCoordinator: async () => ({ ok: false, stage: 'validation' }),
    onValidationFailure: async () => validationCalls.push('validation'),
    onPersistenceFailure: async () => validationCalls.push('persistence'),
    onComplete: async () => validationCalls.push('complete')
  });

  assert.equal(validation.stage, 'validation');
  assert.deepEqual(validationCalls, ['validation']);

  const persistenceCalls = [];
  const persistence = await executeLessonSaveApplication({
    authorize: async () => true,
    readDraft: async () => ({}),
    prepare: async () => ({ draft: {}, items: [] }),
    executeCoordinator: async () => ({ ok: false, stage: 'persistence', error: new Error('DB') }),
    onValidationFailure: async () => persistenceCalls.push('validation'),
    onPersistenceFailure: async () => persistenceCalls.push('persistence'),
    onComplete: async () => persistenceCalls.push('complete')
  });

  assert.equal(persistence.stage, 'persistence');
  assert.deepEqual(persistenceCalls, ['persistence']);
});

test('missing integration dependencies are rejected by the proven runtime flow', async () => {
  await assert.rejects(
    () => executeLessonSaveApplication({}),
    /A lesson save authorization function is required\./
  );
});
