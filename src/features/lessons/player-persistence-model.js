// Deterministic database-row builders for lesson-player test history.
// Contract source: supabase/migrations/20260929140000_create_test_history.sql.
// This module does not perform persistence and does not guess UI/runtime behavior.

const text = value => String(value ?? '').trim();

function toNullableText(value) {
  const normalized = text(value);
  return normalized || null;
}

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
      question_order: Number(answer?.questionOrder ?? index) || 0,
      question: text(item.question ?? answer?.question),
      expected_answer: toNullableText(item.answer ?? answer?.expected),
      given_answer: toNullableText(answer?.value ?? answer?.givenAnswer),
      is_correct: answer?.correct === true,
      question_type: text(answer?.questionType || item.type || 'text') || 'text',
      answered_at: answer?.answeredAt || finishedAt || null
    };
  });
}
