// Persistence boundary for lesson-player test results.
// Runtime wiring is intentionally deferred. This module accepts the exact rows
// prepared by the player and performs only the persistence sequence.

export function createPlayerPersistence(db) {
  if (!db) throw new Error('A Supabase client is required.');

  async function saveTestResult({ attempt, answers = [] } = {}) {
    if (!attempt || typeof attempt !== 'object') {
      throw new Error('A test attempt is required.');
    }

    const { data: savedAttempt, error: attemptError } = await db
      .from('test_attempts')
      .insert(attempt)
      .select()
      .single();

    if (attemptError) throw attemptError;

    const attemptId = savedAttempt?.id;
    if (attemptId == null) throw new Error('Test attempt kreeg geen id.');

    const rows = (Array.isArray(answers) ? answers : []).map(answer => ({
      ...answer,
      attempt_id: attemptId
    }));

    if (!rows.length) {
      return { attempt: savedAttempt, answers: [] };
    }

    const { data: savedAnswers, error: answersError } = await db
      .from('test_attempt_answers')
      .insert(rows)
      .select();

    if (answersError) throw answersError;

    return { attempt: savedAttempt, answers: savedAnswers || [] };
  }

  return Object.freeze({ saveTestResult });
}
