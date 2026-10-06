// Runtime adapter for the modular lesson-player chain.
// This is the only boundary that combines player state with app-facing
// persistence, rendering, activity cleanup, and navigation callbacks.
// It is intentionally unmounted from the V4.78 runtime until parity is proven.

import { createTestSession } from './player-session.js';
import { createPlayerAttempt } from './player-attempt.js';
import { finishPlayerTest } from './player-finish-flow.js';
import {
  buildTestAttemptRow,
  buildTestAttemptAnswerRows
} from './player-persistence-model.js';

export function createPlayerRuntimeAdapter({
  lesson = null,
  student = null,
  persistence = null,
  renderResult = null,
  cancelSpeech = () => {},
  clearActivity = () => {},
  showLessonChoice = () => {},
  goBack = () => {},
  clock = () => new Date().toISOString(),
  createSession = createTestSession
} = {}) {
  if (!lesson || typeof lesson !== 'object') {
    throw new Error('A lesson is required.');
  }
  if (!persistence || typeof persistence.saveTestResult !== 'function') {
    throw new Error('A player persistence service is required.');
  }
  if (typeof renderResult !== 'function') {
    throw new Error('A result renderer is required.');
  }
  if (typeof clock !== 'function') {
    throw new Error('A player clock is required.');
  }
  if (typeof createSession !== 'function') {
    throw new Error('A test-session factory is required.');
  }

  let session = null;

  function startTest({
    items = lesson.lesson_items || [],
    type = lesson.type || 'words',
    startedAt = clock(),
    shuffle
  } = {}) {
    session = createSession(items, { type, startedAt, ...(shuffle ? { shuffle } : {}) });
    return session;
  }

  async function finishTest({ finishedAt = clock() } = {}) {
    if (!session) throw new Error('No active test session.');

    const attempt = createPlayerAttempt({
      lesson,
      student,
      session,
      finishedAt
    });

    const total = attempt.answers.length;
    const correct = attempt.answers.filter(answer => answer?.correct === true).length;
    const attemptRow = buildTestAttemptRow({
      lessonId: attempt.lessonId,
      student: attempt.student,
      correct,
      total,
      startedAt: attempt.startedAt,
      completedAt: attempt.finishedAt,
      isTest: true
    });
    const answerRows = buildTestAttemptAnswerRows(attempt.answers, {
      questionType: attempt.type
    });

    const saveTestAttempt = ({ attempt: completedAttempt } = {}) =>
      persistence.saveTestResult({
        attempt: {
          ...attemptRow,
          ...completedAttempt
        },
        answers: answerRows
      });

    return finishPlayerTest({
      attempt,
      saveTestAttempt,
      renderResult,
      cancelSpeech,
      clearActivity
    });
  }

  function retry() {
    showLessonChoice(lesson);
  }

  function back() {
    goBack();
  }

  return Object.freeze({
    get session() { return session; },
    startTest,
    finishTest,
    retry,
    back
  });
}
