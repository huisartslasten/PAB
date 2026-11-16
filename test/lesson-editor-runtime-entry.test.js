import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonEditorRuntime } from '../src/features/lessons/lesson-editor-runtime-entry.js';

test('lesson editor runtime delegates persistence to the injected save boundary', async () => {
  const calls = [];
  const saveDraft = async draft => {
    calls.push(draft);
    return { ok: true, stage: 'complete', lessonId: 42, testDate: draft.testDate };
  };
  let refreshCount = 0;

  const runtime = createLessonEditorRuntime({
    saveDraft,
    refreshLessons: async () => { refreshCount += 1; }
  });

  const result = await runtime.save({
    student: 'Zyon',
    subject: 'Taal',
    title: 'Themawoorden',
    type: 'words',
    testDate: '2026-11-11',
    items: [{ question: 'expert', answer: 'deskundige' }]
  });

  assert.equal(result.ok, true);
  assert.equal(result.lessonId, 42);
  assert.equal(result.testDate, '2026-11-11');
  assert.equal(refreshCount, 1);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].lessonId, null);
  assert.equal(calls[0].lesson.student, 'Zyon');
});

test('lesson editor runtime rejects missing persistence boundary', () => {
  assert.throws(
    () => createLessonEditorRuntime({ refreshLessons: async () => {} }),
    /requires saveDraft/
  );
});
