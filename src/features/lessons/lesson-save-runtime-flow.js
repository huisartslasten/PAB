// Pure orchestration seam for the V4.78 saveLesson() runtime flow.
// Runtime concerns are injected; this module does not access DOM, auth, state,
// persistence, rendering, navigation, or localStorage directly.

import { buildLessonSaveExecutionRequest } from './lesson-save-request.js';

export async function executeLessonSaveRuntimeFlow({
  authorize,
  readDraft,
  prepare,
  executeCoordinator,
  editorRows = [],
  onValidationFailure,
  onPersistenceFailure,
  onComplete
} = {}) {
  if (typeof authorize !== 'function') throw new Error('A lesson save authorization function is required.');
  if (typeof readDraft !== 'function') throw new Error('A lesson save draft reader is required.');
  if (typeof prepare !== 'function') throw new Error('A lesson save preparation function is required.');
  if (typeof executeCoordinator !== 'function') throw new Error('A lesson save coordinator function is required.');

  const authorized = await authorize();
  if (!authorized) {
    return Object.freeze({ ok: false, stage: 'authorization' });
  }

  const draft = await readDraft();
  const prepared = await prepare({ draft, editorRows });
  if (!prepared || typeof prepared !== 'object') {
    throw new Error('Lesson save preparation returned no input.');
  }

  const execution = buildLessonSaveExecutionRequest({
    lessonId: prepared.draft?.lessonId,
    lesson: prepared.draft?.lesson,
    items: prepared.items,
    testDate: prepared.draft?.testDate
  });

  const result = await executeCoordinator({
    draft: {
      ...prepared.draft,
      lessonId: execution.id,
      lesson: execution.lesson,
      testDate: execution.testDate
    },
    collectItems: async () => execution.items
  });

  if (!result?.ok) {
    if (result.stage === 'validation' && typeof onValidationFailure === 'function') {
      await onValidationFailure(result);
    } else if (result.stage === 'persistence' && typeof onPersistenceFailure === 'function') {
      await onPersistenceFailure(result);
    }
    return result;
  }

  if (typeof onComplete === 'function') {
    await onComplete(result);
  }

  return result;
}
