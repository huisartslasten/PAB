// Pure composition boundary for completed lesson tests.
// It keeps database score (correct-count) separate from presentation grade (1–10).
// No Supabase execution, DOM work, or navigation belongs here.

import { createPlayerResult } from './player-result.js';
import { buildTestAttemptRow, buildTestAttemptAnswerRows } from './player-persistence-model.js';

export function createPlayerCompletionPackage(completion = {}) {
  const answers = Array.isArray(completion.answers) ? completion.answers : [];
  const total = Number(completion.total ?? answers.length) || 0;
  const correct = Number(completion.correct ?? answers.filter(answer => answer?.correct === true).length) || 0;

  const attempt = buildTestAttemptRow({
    lessonId: completion.lessonId,
    student: completion.student,
    correct,
    total,
    startedAt: completion.startedAt,
    completedAt: completion.finishedAt,
    isTest: completion.isTest !== false
  });

  const answerRows = buildTestAttemptAnswerRows(answers, {
    finishedAt: completion.finishedAt
  });

  const result = createPlayerResult({
    lesson: {
      id: completion.lessonId,
      title: completion.lessonTitle,
      type: completion.type
    },
    type: completion.type,
    mode: 'test',
    answers,
    startedAt: completion.startedAt,
    finishedAt: completion.finishedAt
  });

  return Object.freeze({ attempt, answerRows, result });
}
