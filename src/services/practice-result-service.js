// Canonical read boundary for assessment results used by Challenges.
// Assessment persistence is read here; Challenge unlock rules remain owned by
// challenge-unlock-service. The database RPC is a narrow read capability that
// returns only lesson ids which meet the requested assessment threshold and
// explicitly allowed lesson types.

function requireDb(db) {
  if (!db || typeof db.from !== 'function' || typeof db.rpc !== 'function') {
    throw new Error('A Supabase client with table and RPC access is required.');
  }
}

function normalizeMinimumScore(value) {
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 ? score : 0;
}

function normalizeAllowedLessonTypes(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(item => String(item || '').trim()).filter(Boolean))];
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

  async function listLessonIdsMeetingScore(student = '', minimumScore = 0, allowedLessonTypes = []) {
    const normalizedLessonTypes = normalizeAllowedLessonTypes(allowedLessonTypes);
    if (!normalizedLessonTypes.length) return [];

    const { data, error } = await db.rpc('list_student_passed_test_lesson_ids', {
      p_student: String(student || '').trim(),
      p_minimum_score: normalizeMinimumScore(minimumScore),
      p_allowed_lesson_types: normalizedLessonTypes
    });
    if (error) throw error;

    return [...new Set(
      (Array.isArray(data) ? data : [])
        .map(row => Number(row?.lesson_id))
        .filter(Number.isFinite)
    )];
  }

  return Object.freeze({
    listAssessments,
    listPassedAssessments,
    listPassedLessonIds,
    listLessonIdsMeetingScore
  });
}
