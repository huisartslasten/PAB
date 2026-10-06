// Persistence boundary for lesson-player test results.
// Runtime wiring is intentionally deferred. This module accepts the exact rows
// prepared by the player and performs only the persistence sequence.

export function createPlayerPersistence(db, { clock = () => new Date().toISOString() } = {}) {
  if (!db) throw new Error('A Supabase client is required.');
  if (typeof clock !== 'function') throw new Error('A persistence clock is required.');

  async function saveTestResult({ attempt, answers = [] } = {}) {
    if (!attempt || typeof attempt !== 'object') {
      throw new Error('A test attempt is required.');
    }

    // V4.78 creates completed_at once when the attempt is saved and falls back
    // to a fresh timestamp for started_at when the caller did not supply one.
    const completedAt = attempt.completed_at || clock();
    const startedAt = attempt.started_at || clock();
    const attemptRow = {
      ...attempt,
      started_at: startedAt,
      completed_at: completedAt
    };

    const { data: savedAttempt, error: attemptError } = await db
      .from('test_attempts')
      .insert(attemptRow)
      .select()
      .single();

    if (attemptError) throw attemptError;

    const attemptId = savedAttempt?.id;
    if (attemptId == null) throw new Error('Test attempt kreeg geen id.');

    const rows = (Array.isArray(answers) ? answers : []).map(answer => ({
      ...answer,
      attempt_id: attemptId,
      answered_at: answer?.answered_at || clock()
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
