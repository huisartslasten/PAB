// Canonical read boundary for assessment results used by Challenges.
// A passed assessment is derived from the persisted assessment result only;
// Challenge code never calculates scores itself.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') throw new Error('A Supabase client is required.');
}

function isPassed(attempt) {
  const total = Number(attempt?.total_questions) || 0;
  const score = Number(attempt?.score) || 0;
  return total > 0 && score === total;
}

export function createPracticeResultService(db) {
  requireDb(db);

  async function listPassedAssessments(student = '') {
    let query = db
      .from('test_attempts')
      .select('id,lesson_id,student,score,total_questions,started_at,completed_at,is_test')
      .eq('is_test', true)
      .order('completed_at', { ascending: false });

    if (student) query = query.eq('student', student);

    const { data, error } = await query;
    if (error) throw error;

    const latestByLesson = new Map();
    for (const attempt of Array.isArray(data) ? data : []) {
      const key = `${attempt.student || ''}:${attempt.lesson_id}`;
      if (!latestByLesson.has(key)) latestByLesson.set(key, attempt);
    }

    return [...latestByLesson.values()]
      .filter(isPassed)
      .map(attempt => Object.freeze({
        lessonId: attempt.lesson_id,
        student: attempt.student,
        score: Number(attempt.score) || 0,
        totalQuestions: Number(attempt.total_questions) || 0,
        completedAt: attempt.completed_at || null
      }));
  }

  async function listPassedLessonIds(student = '') {
    const results = await listPassedAssessments(student);
    return [...new Set(results.map(result => Number(result.lessonId)).filter(Number.isFinite))];
  }

  return Object.freeze({ listPassedAssessments, listPassedLessonIds });
}

export { isPassed as isPracticeAssessmentPassed };
