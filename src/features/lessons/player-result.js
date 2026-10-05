// Pure result model for lesson-player completion.
// No UI, persistence, or navigation belongs here.
//
// V4.78 reference: test results show a grade on a 1.0–10.0 scale,
// plus correct/total and a per-answer review. The result model keeps
// those facts without deciding how the UI renders them.

function calculateGrade(correct, total) {
  if (!total) return 0;
  return Math.round((Number(correct) / Number(total) * 10) * 10) / 10;
}

function mapAnswer(answer = {}) {
  const item = answer?.item || {};
  return {
    itemId: item?.id ?? answer?.itemId ?? null,
    question: String(item?.question ?? answer?.question ?? '').trim(),
    value: String(answer?.value ?? '').trim(),
    expected: String(item?.answer ?? answer?.expected ?? '').trim(),
    correct: answer?.correct === true,
    feedback: String(answer?.feedback ?? '').trim()
  };
}

export function createPlayerResult({
  lesson = null,
  type = 'words',
  mode = 'test',
  answers = [],
  startedAt = null,
  finishedAt = null
} = {}) {
  const list = Array.isArray(answers) ? answers : [];
  const mappedAnswers = list.map(mapAnswer);
  const total = mappedAnswers.length;
  const correct = mappedAnswers.filter(answer => answer.correct).length;

  return Object.freeze({
    lessonId: lesson?.id ?? null,
    lessonTitle: String(lesson?.title ?? ''),
    type: String(type || 'words'),
    mode,
    total,
    correct,
    incorrect: Math.max(0, total - correct),
    score: calculateGrade(correct, total),
    title: type === 'dictation' ? '✏️ Dictee klaar!' : '📝 Toets klaar!',
    answers: mappedAnswers,
    startedAt,
    finishedAt
  });
}
