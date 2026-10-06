// Application integration contract for the V4.78 lesson save flow.
// This is the final injectable adapter before replacing the legacy saveLesson() call site.
// It composes the proven runtime flow and effects without importing DOM/global application code.

import { executeLessonSaveRuntimeFlow } from './lesson-save-runtime-flow.js';

export async function executeLessonSaveApplication({
  authorize,
  readDraft,
  prepare,
  executeCoordinator,
  editorRows = [],
  onValidationFailure,
  onPersistenceFailure,
  onComplete
} = {}) {
  return executeLessonSaveRuntimeFlow({
    authorize,
    readDraft,
    prepare,
    executeCoordinator,
    editorRows,
    onValidationFailure,
    onPersistenceFailure,
    onComplete
  });
}
