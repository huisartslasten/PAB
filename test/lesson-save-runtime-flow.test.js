import test from 'node:test';
import assert from 'node:assert/strict';
import { executeLessonSaveRuntimeFlow } from '../src/features/lessons/lesson-save-runtime-flow.js';

test('authorization failure stops the save flow before draft extraction', async () => {
  const calls = [];

  const result = await executeLessonSaveRuntimeFlow({
    authorize: async () => {
      calls.push('authorize');
      return false;
    },
    readDraft: async () => {
      calls.push('readDraft');
      throw new Error('must not read');
    },
    prepare: async () => {
      calls.push('prepare');
      throw new Error('must not prepare');
    },
    executeCoordinator: async () => {
      calls.push('coordinator');
      throw new Error('must not execute');
    }
  });

  assert.deepEqual(calls, ['authorize']);
  assert.deepEqual(result, { ok: false, stage: 'authorization' });
});

test('successful flow preserves draft, items, test date, and execution order', async () => {
  const calls = [];
  let coordinatorInput;

  const result = await executeLessonSaveRuntimeFlow({
    authorize: async () => {
      calls.push('authorize');
      return true;
    },
    readDraft: async () => {
      calls.push('readDraft');
      return { lessonId: 42, testDate: '2026-10-10' };
    },
    prepare: async ({ draft, editorRows }) => {
      calls.push(`prepare:${editorRows.length}`);
      return {
        draft: {
          ...draft,
          lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Les' }
        },
        items: [{ question: 'Vraag', answer: 'Antwoord', sort_order: 2 }]
      };
    },
    executeCoordinator: async input => {
      calls.push('coordinator');
      coordinatorInput = input;
      return { ok: true, stage: 'complete', outcome: { testCalendarAction: 'upsert' } };
    },
    editorRows: ['row']
  });

  assert.deepEqual(calls, ['authorize', 'readDraft', 'prepare:1', 'coordinator']);
  assert.equal(coordinatorInput.draft.lessonId, 42);
  assert.equal(coordinatorInput.draft.testDate, '2026-10-10');
  assert.deepEqual(await coordinatorInput.collectItems(), [
    { question: 'Vraag', answer: 'Antwoord', sort_order: 2 }
  ]);
  assert.equal(result.ok, true);
});

test('validation failure is returned and does not run completion side effects', async () => {
  const calls = [];
  let validationResult;

  const result = await executeLessonSaveRuntimeFlow({
    authorize: async () => true,
    readDraft: async () => ({ lessonId: null, testDate: '' }),
    prepare: async () => ({
      draft: { lessonId: null, lesson: {}, testDate: '' },
      items: []
    }),
    executeCoordinator: async () => ({
      ok: false,
      stage: 'validation',
      validation: { valid: false }
    }),
    onValidationFailure: async value => {
      calls.push('validation');
      validationResult = value;
    },
    onComplete: async () => calls.push('complete')
  });

  assert.equal(result.ok, false);
  assert.equal(result.stage, 'validation');
  assert.equal(validationResult, result);
  assert.deepEqual(calls, ['validation']);
});

test('persistence failure is returned and does not run completion side effects', async () => {
  const calls = [];

  const result = await executeLessonSaveRuntimeFlow({
    authorize: async () => true,
    readDraft: async () => ({ lessonId: 42, testDate: '' }),
    prepare: async () => ({
      draft: { lessonId: 42, lesson: { student: 'Zyon' }, testDate: '' },
      items: [{ question: 'Vraag', answer: 'Antwoord' }]
    }),
    executeCoordinator: async () => ({ ok: false, stage: 'persistence', error: new Error('DB') }),
    onPersistenceFailure: async () => calls.push('persistence'),
    onComplete: async () => calls.push('complete')
  });

  assert.equal(result.ok, false);
  assert.equal(result.stage, 'persistence');
  assert.deepEqual(calls, ['persistence']);
});

test('missing runtime dependency is rejected explicitly', async () => {
  await assert.rejects(
    () => executeLessonSaveRuntimeFlow({}),
    /A lesson save authorization function is required\./
  );
});
