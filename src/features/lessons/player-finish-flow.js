// Deterministic orchestration for the V4.78 finishTest() contract.
// Rendering, persistence and activity cleanup are injected.
// No DOM, HTML escaping, speech control, navigation or database implementation belongs here.

import { createPlayerResult } from './player-result.js';

export async function finishPlayerTest({
  attempt = null,
  saveTestAttempt,
  renderResult,
  clearActivity
} = {}) {
  if (!attempt || typeof attempt !== 'object') {
    throw new Error('A test attempt is required.');
  }
  if (typeof saveTestAttempt !== 'function') {
    throw new Error('A test-history save function is required.');
  }
  if (typeof renderResult !== 'function') {
    throw new Error('A result renderer is required.');
  }

  const answers = Array.isArray(attempt.answers) ? attempt.answers : [];
  const result = createPlayerResult({
    lesson: {
      id: attempt.lessonId ?? attempt.lesson_id ?? null,
      title: attempt.lessonTitle ?? attempt.title ?? '',
      type: attempt.type
    },
    type: attempt.type,
    mode: 'test',
    answers,
    startedAt: attempt.startedAt ?? attempt.started_at ?? null,
    finishedAt: attempt.finishedAt ?? null
  });

  // V4.78 lets persistence errors propagate. It does not render a result after
  // a failed history save, and it does not clear the active activity in that case.
  await saveTestAttempt(attempt);
  await renderResult(Object.freeze({ result }));
  clearActivity?.();

  return Object.freeze({ result });
}
