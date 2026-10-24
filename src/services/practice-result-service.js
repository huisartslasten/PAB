// Canonical read boundary for assessment results used by Challenges.
// Assessment persistence is read here; Challenge unlock rules are evaluated by
// challenge-unlock-service, never by Challenge pages or runtimes.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') throw new Error('A Supabase client is required.');
}

export function createPracticeResultService(db) {
  requireDb(db);

  async function listAssessments(student = '') {
    let query = db
      .from('test_attempts')
      .select('id,lesson_id,student,score,total_questions,started_at,completed_at,is_test')
      .eq('is_test', true)
      .order('completed_at', { ascending: false });

    if (student) query = query.eq('student', student);

    const { data, error } = await query;
    if (error) throw error;

    return (Array.isArray(data) ? data : []).map(attempt => Object.freeze({
      id: attempt.id,
      lessonId: attempt.lesson_id,
      student: attempt.student,
      score: Number(attempt.score) || 0,
      totalQuestions: Number(attempt.total_questions) || 0,
      startedAt: attempt.started_at || null,
      completedAt: attempt.completed_at || null,
      isTest: attempt.is_test === true
    }));
  }

  async function listPassedAssessments(student = '') {
    const assessments = await listAssessments(student);
    return assessments.filter(attempt => attempt.totalQuestions > 0 && attempt.score === attempt.totalQuestions);
  }

  async function listPassedLessonIds(student = '') {
    const results = await listPassedAssessments(student);
    return [...new Set(results.map(result => Number(result.lessonId)).filter(Number.isFinite))];
  }

  return Object.freeze({ listAssessments, listPassedAssessments, listPassedLessonIds });
}
