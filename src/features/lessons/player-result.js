// Pure result model for lesson-player completion.
// No UI, persistence, or navigation belongs here.

export function createPlayerResult({
  lesson = null,
  mode = 'test',
  answers = [],
  startedAt = null,
  finishedAt = null
} = {}) {
  const list = Array.isArray(answers) ? answers : [];
  const total = list.length;
  const correct = list.filter(answer => answer?.correct === true).length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  return Object.freeze({
    lessonId: lesson?.id ?? null,
    lessonTitle: lesson?.title ?? '',
    mode,
    total,
    correct,
    incorrect: Math.max(0, total - correct),
    score,
    answers: list.slice(),
    startedAt,
    finishedAt
  });
}
