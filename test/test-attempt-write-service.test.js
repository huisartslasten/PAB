import test from 'node:test';
import assert from 'node:assert/strict';
import { saveTestAttemptPersistence } from '../src/features/test-history/test-attempt-write-service.js';

function createDb({ attemptError = null, answerError = null } = {}) {
  const calls = [];
  const db = {
    from(table) {
      return {
        insert(payload) {
          calls.push({ table, operation: 'insert', payload });
          if (table === 'test_attempts') {
            return {
              select() {
                return {
                  single: async () => ({ data: { id: 91 }, error: attemptError })
                };
              }
            };
          }
          return Promise.resolve({ error: answerError });
        }
      };
    }
  };
  return { db, calls };
}

function attempt() {
  return {
    type: 'words',
    startedAt: '2026-10-06T20:00:00.000Z',
    answers: [
      { item: { question: 'appel', answer: 'fruit' }, value: 'fruit', correct: true },
      { item: { question: 'peer', answer: 'fruit' }, value: 'boom', correct: false }
    ]
  };
}

test('persists test attempt and its answers with V4.78 payload shape', async () => {
  const { db, calls } = createDb();
  const result = await saveTestAttemptPersistence({
    db,
    lessonId: 42,
    student: 'Zyon',
    attempt: attempt(),
    currentLessonType: 'words'
  });

  assert.deepEqual(result, { attemptId: 91, score: 1, totalQuestions: 2, answerCount: 2 });
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0], {
    table: 'test_attempts',
    operation: 'insert',
    payload: {
      lesson_id: 42,
      student: 'Zyon',
      score: 1,
      total_questions: 2,
      started_at: '2026-10-06T20:00:00.000Z',
      completed_at: calls[0].payload.completed_at,
      is_test: true
    }
  });
  assert.equal(calls[1].table, 'test_attempt_answers');
  assert.equal(calls[1].payload[0].attempt_id, 91);
  assert.deepEqual(calls[1].payload.map(row => ({
    question_order: row.question_order,
    question: row.question,
    expected_answer: row.expected_answer,
    given_answer: row.given_answer,
    is_correct: row.is_correct,
    question_type: row.question_type
  })), [
    { question_order: 1, question: 'appel', expected_answer: 'fruit', given_answer: 'fruit', is_correct: true, question_type: 'words' },
    { question_order: 2, question: 'peer', expected_answer: 'fruit', given_answer: 'boom', is_correct: false, question_type: 'words' }
  ]);
});

test('skips persistence when the V4.78 guard conditions are absent', async () => {
  const { db, calls } = createDb();
  const result = await saveTestAttemptPersistence({ db, lessonId: 42, student: 'Zyon', attempt: { answers: [] } });
  assert.equal(result, null);
  assert.deepEqual(calls, []);
});

test('propagates test-attempt insert errors and does not insert answers', async () => {
  const { db, calls } = createDb({ attemptError: new Error('attempt failed') });
  await assert.rejects(
    saveTestAttemptPersistence({ db, lessonId: 42, student: 'Zyon', attempt: attempt() }),
    /attempt failed/
  );
  assert.equal(calls.length, 1);
});

test('propagates answer insert errors after the attempt exists', async () => {
  const { db, calls } = createDb({ answerError: new Error('answer failed') });
  await assert.rejects(
    saveTestAttemptPersistence({ db, lessonId: 42, student: 'Zyon', attempt: attempt() }),
    /answer failed/
  );
  assert.equal(calls.length, 2);
});
