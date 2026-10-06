// Pure completion boundary for lesson-player tests.
// This module assembles the facts needed by persistence and result presentation.
// It deliberately does not perform Supabase writes, UI rendering, or navigation.

export function createPlayerCompletion({
  lesson = null,
  session = null,
  answers = null,
  finishedAt = null
} = {}) {
  const sessionAnswers = Array.isArray(session?.answers) ? session.answers : [];
  const list = Array.isArray(answers) ? answers : sessionAnswers;
  const total = list.length;
  const correct = list.filter(answer => answer?.correct === true).length;

  return Object.freeze({
    lessonId: lesson?.id ?? null,
    student: lesson?.student ?? null,
    lessonTitle: lesson?.title ?? '',
    type: lesson?.type ?? 'words',
    answers: list.slice(),
    total,
    correct,
    incorrect: Math.max(0, total - correct),
    startedAt: session?.startedAt ?? null,
    finishedAt: finishedAt ?? null,
    isTest: true
  });
}
