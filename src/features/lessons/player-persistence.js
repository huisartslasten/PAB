// Persistence boundary for lesson-player test results.
// Runtime wiring is intentionally deferred. This module accepts the exact rows
// prepared by the player and performs only the V4.78 persistence sequence.
//
// V4.78 sequence:
// 1. Insert one test_attempts row.
// 2. Read the generated attempt id.
// 3. Insert test_attempt_answers rows linked by attempt_id.
// 4. Do not create answer rows when the attempt has no answers.

export function createPlayerPersistence(db, { clock = () => new Date().toISOString() } = {}) {
  if (!db) throw new Error('A Supabase client is required.');
  if (typeof clock !== 'function') throw new Error('A persistence clock is required.');

  async function saveTestResult({ attempt, answers = [] } = {}) {
    if (!attempt || typeof attempt !== 'object') {
      throw new Error('A test attempt is required.');
    }

    const answerList = Array.isArray(answers) ? answers : [];

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

    if (!answerList.length) {
      return { attempt: savedAttempt, answers: [] };
    }

    const rows = answerList.map(answer => ({
      ...answer,
      attempt_id: attemptId,
      answered_at: answer?.answered_at || clock()
    }));

    const { data: savedAnswers, error: answersError } = await db
      .from('test_attempt_answers')
      .insert(rows)
      .select();

    if (answersError) throw answersError;

    return { attempt: savedAttempt, answers: savedAnswers || [] };
  }

  return Object.freeze({ saveTestResult });
}
