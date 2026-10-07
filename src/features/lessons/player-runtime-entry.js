// Application runtime entry for the professional lesson player.
// Composition stays separate from DOM wiring; this entry only starts the
// application-owned runtime and exposes the canonical submit/finish boundary.

import { createApplicationPlayerRuntime } from './player-runtime-composition.js';
import { createPlayerSubmitBoundary } from './player-submit-boundary.js';

export function createPlayerRuntimeEntry({
  lesson = null,
  student = null,
  db = null,
  persistence = null,
  renderResult = null,
  cancelSpeech = () => {},
  clearActivity = () => {},
  showLessonChoice = () => {},
  goBack = () => {},
  clock = () => new Date().toISOString(),
  createSession,
  gradeAnswer = null,
  documentRef = globalThis.document
} = {}) {
  const runtime = createApplicationPlayerRuntime({
    lesson,
    student,
    db,
    persistence,
    renderResult,
    cancelSpeech,
    clearActivity,
    showLessonChoice,
    goBack,
    clock,
    createSession,
    gradeAnswer
  });

  const submitBoundary = createPlayerSubmitBoundary({
    adapter: runtime,
    documentRef
  });

  return Object.freeze({
    runtime,
    submitBoundary,
    startTest: options => runtime.startTest(options),
    submitTest: options => submitBoundary.submitTest(options),
    finishTest: options => runtime.finishTest(options),
    retry: () => runtime.retry(),
    back: () => runtime.back()
  });
}
