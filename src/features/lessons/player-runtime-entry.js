// Application runtime entry for the professional lesson player.
// Composition stays separate from DOM wiring; this entry owns application
// rendering orchestration and the V4.78 submit-to-finish boundary.

import { createApplicationPlayerRuntime } from './player-runtime-composition.js';
import { createPlayerSubmitBoundary } from './player-submit-boundary.js';

export function createPlayerRuntimeEntry({
  lesson = null,
  student = null,
  db = null,
  persistence = null,
  prepareTestView = () => {},
  renderTest = null,
  renderResult = null,
  cancelSpeech = () => {},
  stopAiAudio = () => {},
  clearActivity = () => {},
  showLessonChoice = () => {},
  goBack = () => {},
  clock = () => new Date().toISOString(),
  shuffle = null,
  createSession,
  gradeAnswer = null,
  documentRef = globalThis.document
} = {}) {
  const runtime = createApplicationPlayerRuntime({ lesson, student, db, persistence, renderResult, cancelSpeech, clearActivity, showLessonChoice, goBack, clock, createSession, gradeAnswer });
  if (typeof prepareTestView !== 'function') throw new Error('A test view preparer is required.');
  if (typeof renderTest !== 'function') throw new Error('A test renderer is required.');
  if (shuffle !== null && typeof shuffle !== 'function') throw new Error('A shuffle function is required when provided.');

  const submitBoundary = createPlayerSubmitBoundary({ adapter: runtime, documentRef });

  function renderCurrentTest() {
    const session = runtime.session;
    renderTest({ session, item: session.currentItem(), index: session.index, total: session.total, type: session.type });
  }

  function startTest(options = {}) {
    const type = options.type || lesson.type || 'words';
    cancelSpeech?.();
    stopAiAudio?.();
    prepareTestView({ type, lesson });
    const sessionOptions = { ...options, type };
    if (!Object.prototype.hasOwnProperty.call(options, 'shuffle') && shuffle) sessionOptions.shuffle = shuffle;
    const session = runtime.startTest(sessionOptions);
    renderCurrentTest();
    return session;
  }

  async function submitTest(options = {}) {
    const result = await submitBoundary.submitTest(options);
    if (!result) return null;
    if (result.done) return runtime.finishTest({ finishedAt: clock() });
    renderCurrentTest();
    return result;
  }

  return Object.freeze({ runtime, submitBoundary, startTest, submitTest, finishTest: options => runtime.finishTest(options), retry: () => runtime.retry(), back: () => runtime.back() });
}
