function requireDb(db) {
  if (!db || typeof db.from !== 'function') {
    throw new Error('A Supabase client is required.');
  }
}

export async function saveTestAttemptPersistence({ db, lessonId, student, attempt, currentLessonType } = {}) {
  requireDb(db);
  if (!attempt?.answers?.length || !student || !lessonId) return null;

  const total = attempt.answers.length;
  const score = attempt.answers.filter(answer => answer.correct).length;
  const inserted = await db
    .from('test_attempts')
    .insert({
      lesson_id: lessonId,
      student,
      score,
      total_questions: total,
      started_at: attempt.startedAt || new Date().toISOString(),
      completed_at: new Date().toISOString(),
      is_test: true
    })
    .select()
    .single();

  if (inserted.error) throw inserted.error;

  const rows = attempt.answers.map((answer, index) => ({
    attempt_id: inserted.data.id,
    question_order: index + 1,
    question: String(answer.item?.question ?? ''),
    expected_answer: String(answer.item?.answer ?? ''),
    given_answer: String(answer.value ?? ''),
    is_correct: answer.correct === true,
    question_type: attempt.type || currentLessonType,
    answered_at: new Date().toISOString()
  }));

  const answerInsert = await db.from('test_attempt_answers').insert(rows);
  if (answerInsert.error) throw answerInsert.error;

  return Object.freeze({
    attemptId: inserted.data.id,
    score,
    totalQuestions: total,
    answerCount: rows.length
  });
}
