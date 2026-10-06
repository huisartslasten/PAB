// Deterministic orchestration for the V4.78 finishTest() contract.
// Rendering, speech cancellation, persistence and activity cleanup are injected.
// No DOM, HTML escaping, navigation or database implementation belongs here.

import { createPlayerResult } from './player-result.js';

export async function finishPlayerTest({
  attempt = null,
  saveTestAttempt,
  renderResult,
  cancelSpeech,
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

  cancelSpeech?.();

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

  let historyError = null;
  try {
    await saveTestAttempt(attempt);
  } catch (error) {
    // V4.78 still completes and renders the result when history persistence fails.
    historyError = error;
  }

  await renderResult(Object.freeze({ result, historyError }));
  clearActivity?.();

  return Object.freeze({ result, historyError });
}
