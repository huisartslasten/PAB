function requireDb(db) {
  if (!db || typeof db.from !== 'function') {
    throw new Error('A Supabase client is required.');
  }
}

export function createTestHistoryReadService(db) {
  requireDb(db);

  return Object.freeze({
    async listAttempts(studentFilter = '') {
      let query = db
        .from('test_attempts')
        .select('id,lesson_id,student,score,total_questions,started_at,completed_at,test_attempt_answers(id,question_order,question,expected_answer,given_answer,is_correct,question_type,answered_at)')
        .order('completed_at', { ascending: false });

      if (studentFilter) query = query.eq('student', studentFilter);

      const { data, error } = await query;
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    }
  });
}
