import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTestAttemptRow,
  buildTestAttemptAnswerRows
} from '../src/features/lessons/player-persistence-model.js';

test('test attempt row matches the test-history schema contract', () => {
  const row = buildTestAttemptRow({
    lessonId: 7,
    student: 'Zyon',
    correct: 8,
    total: 10,
    startedAt: '2026-10-05T10:00:00.000Z',
    completedAt: '2026-10-05T10:05:00.000Z'
  });

  assert.deepEqual(row, {
    lesson_id: 7,
    student: 'Zyon',
    score: 8,
    total_questions: 10,
    started_at: '2026-10-05T10:00:00.000Z',
    completed_at: '2026-10-05T10:05:00.000Z',
    is_test: true
  });
});

test('answer rows preserve order, question, expected answer and learner answer', () => {
  const rows = buildTestAttemptAnswerRows([
    {
      item: { question: 'Capital of France?', answer: 'Paris' },
      value: 'Paris',
      correct: true
    },
    {
      item: { question: '2 + 2', answer: '4' },
      value: '5',
      correct: false,
      questionType: 'math'
    }
  ], { finishedAt: '2026-10-05T10:05:00.000Z' });

  assert.deepEqual(rows, [
    {
      question_order: 0,
      question: 'Capital of France?',
      expected_answer: 'Paris',
      given_answer: 'Paris',
      is_correct: true,
      question_type: 'text',
      answered_at: '2026-10-05T10:05:00.000Z'
    },
    {
      question_order: 1,
      question: '2 + 2',
      expected_answer: '4',
      given_answer: '5',
      is_correct: false,
      question_type: 'math',
      answered_at: '2026-10-05T10:05:00.000Z'
    }
  ]);
});

test('missing optional answer text becomes null instead of an invented value', () => {
  const [row] = buildTestAttemptAnswerRows([{
    question: 'Vraag',
    value: '',
    expected: '',
    correct: false
  }]);

  assert.equal(row.question, 'Vraag');
  assert.equal(row.expected_answer, null);
  assert.equal(row.given_answer, null);
});
