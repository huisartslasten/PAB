// Application integration contract for the V4.78 lesson save flow.
// This is the final injectable adapter before replacing the legacy saveLesson() call site.
// It composes the proven runtime flow and runtime-effects boundary without importing
// DOM/global application code. Runtime effects are injected by the caller.

import { executeLessonSaveRuntimeFlow } from './lesson-save-runtime-flow.js';

export async function executeLessonSaveApplication({
  authorize,
  readDraft,
  prepare,
  executeCoordinator,
  editorRows = [],
  runtimeEffects = null,
  onValidationFailure,
  onPersistenceFailure,
  onComplete
} = {}) {
  const validationHandler = async result => {
    if (runtimeEffects && typeof runtimeEffects.handleValidationFailure === 'function') {
      await runtimeEffects.handleValidationFailure(result);
    }
    if (typeof onValidationFailure === 'function') await onValidationFailure(result);
  };

  const persistenceHandler = async result => {
    if (runtimeEffects && typeof runtimeEffects.handlePersistenceFailure === 'function') {
      await runtimeEffects.handlePersistenceFailure(result?.error);
    }
    if (typeof onPersistenceFailure === 'function') await onPersistenceFailure(result);
  };

  const completeHandler = async result => {
    if (runtimeEffects && typeof runtimeEffects.handleComplete === 'function') {
      await runtimeEffects.handleComplete(result?.outcome);
    }
    if (typeof onComplete === 'function') await onComplete(result);
  };

  return executeLessonSaveRuntimeFlow({
    authorize,
    readDraft,
    prepare,
    executeCoordinator,
    editorRows,
    onValidationFailure: validationHandler,
    onPersistenceFailure: persistenceHandler,
    onComplete: completeHandler
  });
}
