// Application-facing entry for the modular lesson practice flow.
// This layer composes practice state with explicit presentation callbacks.
// It owns orchestration only; answer evaluation remains in the practice
// evaluation runtime and persistence remains in the lesson services.

import { createApplicationPracticeRuntime } from './practice-runtime.js';

export function createPracticeRuntimeEntry({
  db = null,
  lesson = null,
  shuffle,
  random,
  evaluateAnswer = null,
  aiCheckAnswers = true,
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

  async function submit(answer) {
    const result = await runtime.submit(answer);
    onAnswer(result);
    if (result.done) {
      const snapshot = runtime.snapshot();
      onFinish(snapshot);
      return Object.freeze({ ...result, snapshot });
    }
    renderCurrent();
    return result;
  }

  function finish() {
    const snapshot = runtime.finish();
    onFinish(snapshot);
    return snapshot;
  }

  return Object.freeze({
    runtime,
    start,
    submit,
    finish,
    render: renderCurrent
  });
}
