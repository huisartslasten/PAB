// Temporary architecture probe for the application-facing player entry.
// This file is intentionally not wired into V4.78.
import { createApplicationPlayerRuntime } from './player-runtime-composition.js';
import { createPlayerSubmitBoundary } from './player-submit-boundary.js';

export function createPlayerRuntimeEntryV2({
  lesson = null, student = null, db = null, persistence = null,
  renderTest, renderResult, cancelSpeech = () => {}, clearActivity = () => {},
  showLessonChoice = () => {}, goBack = () => {}, clock = () => new Date().toISOString(),
  createSession, gradeAnswer = null, documentRef = globalThis.document
} = {}) {
  if (typeof renderTest !== 'function') throw new Error('A test renderer is required.');
  const runtime = createApplicationPlayerRuntime({ lesson, student, db, persistence, renderResult, cancelSpeech, clearActivity, showLessonChoice, goBack, clock, createSession, gradeAnswer });
  const submitBoundary = createPlayerSubmitBoundary({ adapter: runtime, documentRef });
  const renderCurrent = () => renderTest({ item: runtime.session.currentItem(), index: runtime.session.index, total: runtime.session.total, type: runtime.session.type, session: runtime.session });
  const startTest = (options = {}) => { const session = runtime.startTest(options); renderCurrent(); return session; };
  const submitTest = async (options = {}) => { const result = await submitBoundary.submitTest(options); if (!result) return null; if (result.done) return runtime.finishTest({ finishedAt: clock() }); renderCurrent(); return result; };
  return Object.freeze({ runtime, submitBoundary, startTest, submitTest, finishTest: options => runtime.finishTest(options), retry: () => runtime.retry(), back: () => runtime.back() });
}
