// Deterministic database-row builders for lesson-player test history.
// Contract source: TEST V4.78 completion -> saveTestAttempt().
// This module does not perform persistence and does not guess UI/runtime behavior.

const text = value => String(value ?? '').trim();

export function buildTestAttemptRow({
  lessonId,
  student,
  correct = 0,
  total = 0,
  startedAt = null,
  completedAt = null,
  isTest = true
} = {}) {
  return {
    lesson_id: lessonId ?? null,
    student: text(student),
    score: Number(correct) || 0,
    total_questions: Number(total) || 0,
    started_at: startedAt || null,
    completed_at: completedAt || null,
    is_test: isTest !== false
  };
}

export function buildTestAttemptAnswerRows(answers = [], { finishedAt = null } = {}) {
  return (Array.isArray(answers) ? answers : []).map((answer, index) => {
    const item = answer?.item || {};
    return {
      // V4.78 stores question_order as i + 1.
      question_order: Number(answer?.questionOrder ?? index + 1) || 0,
      question: text(item.question ?? answer?.question),
      expected_answer: text(item.answer ?? answer?.expected),
      given_answer: text(answer?.value ?? answer?.givenAnswer),
      is_correct: answer?.correct === true,
      question_type: text(answer?.questionType || item.type || 'text') || 'text',
      // V4.78 assigns the completion timestamp to every persisted answer row.
      answered_at: finishedAt || null
    };
  });
}
