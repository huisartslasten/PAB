// Application runtime entry for the professional lesson player.
// Composition stays separate from DOM wiring; this entry owns the application
// submit boundary and the V4.78 rule that the last answer finishes the test.

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

  async function submitTest(options = {}) {
    const result = await submitBoundary.submitTest(options);
    if (!result) return null;
    if (result.done) {
      return runtime.finishTest();
    }
    return result;
  }

  return Object.freeze({
    runtime,
    submitBoundary,
    startTest: options => runtime.startTest(options),
    submitTest,
    finishTest: options => runtime.finishTest(options),
    retry: () => runtime.retry(),
    back: () => runtime.back()
  });
}
