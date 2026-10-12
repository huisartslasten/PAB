// Application-facing entry for the modular lesson practice flow.
// This layer composes practice state with presentation and persistence callbacks.
// It owns orchestration only; answer evaluation remains in the practice
// evaluation runtime and mastery persistence remains in the mastery service.

import { createApplicationPracticeRuntime } from './practice-runtime.js';
import { createMasteryService } from '../../services/mastery-service.js';

export function createPracticeRuntimeEntry({
  db = null,
  lesson = null,
  student = null,
  shuffle,
  random,
  evaluateAnswer = null,
  aiCheckAnswers = true,
  masteryService = null,
  render = null,
  prepare = () => {},
  onAnswer = () => {},
  onFinish = () => {}
} = {}) {
  if (!lesson || typeof lesson !== 'object') throw new Error('A lesson is required.');
  if (typeof render !== 'function') throw new Error('A practice renderer is required.');
  if (typeof prepare !== 'function') throw new Error('A practice preparer is required.');
  if (typeof onAnswer !== 'function') throw new Error('A practice answer callback is required.');
  if (typeof onFinish !== 'function') throw new Error('A practice finish callback is required.');

  const runtime = createApplicationPracticeRuntime({
    db,
    lesson,
    shuffle,
    random,
    evaluateAnswer,
    aiCheckAnswers
  });
  const mastery = masteryService || createMasteryService();

  function renderCurrent() {
    render(runtime.snapshot());
    return runtime.snapshot();
  }

  function start() {
    prepare({ lesson, type: runtime.type });
    runtime.start();
    runtime.next();
    return renderCurrent();
  }

  function next() {
    const current = runtime.next();
    renderCurrent();
    return current;
  }

  function enrichResult(result, item) {
    const masteryState = student && item
      ? mastery.record(student, lesson.id, item.id, result.correct === true)
      : null;
    const enrichedResult = Object.freeze({ ...result, mastery: masteryState });
    onAnswer(enrichedResult);
    if (result.done) {
      const snapshot = runtime.snapshot();
      onFinish(snapshot);
      return Object.freeze({ ...enrichedResult, snapshot });
    }
    return enrichedResult;
  }

  async function submit(answer) {
    const item = runtime.current;
    const result = await runtime.submit(answer);
    return enrichResult(result, item);
  }

  function assess(correct, evaluation = null) {
    const item = runtime.current;
    const result = runtime.assess(correct, evaluation);
    return enrichResult(result, item);
  }

  function finish() {
    const snapshot = runtime.finish();
    onFinish(snapshot);
    return snapshot;
  }

  return Object.freeze({
    runtime,
    start,
    next,
    submit,
    assess,
    finish,
    render: renderCurrent
  });
}
