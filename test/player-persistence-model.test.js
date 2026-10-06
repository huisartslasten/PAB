import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTestAttemptRow,
  buildTestAttemptAnswerRows
} from '../src/features/lessons/player-persistence-model.js';

test('test attempt row matches the V4.78 test-history payload', () => {
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

test('answer rows match V4.78 order, values, type and completion timestamp', () => {
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
      question_order: 1,
      question: 'Capital of France?',
      expected_answer: 'Paris',
      given_answer: 'Paris',
      is_correct: true,
      question_type: 'text',
      answered_at: '2026-10-05T10:05:00.000Z'
    },
    {
      question_order: 2,
      question: '2 + 2',
      expected_answer: '4',
      given_answer: '5',
      is_correct: false,
      question_type: 'math',
      answered_at: '2026-10-05T10:05:00.000Z'
    }
  ]);
});

test('V4.78 persists empty expected and given answers as empty strings', () => {
  const [row] = buildTestAttemptAnswerRows([{
    question: 'Vraag',
    value: '',
    expected: '',
    correct: false
  }], { finishedAt: 'finish' });

  assert.equal(row.question, 'Vraag');
  assert.equal(row.expected_answer, '');
  assert.equal(row.given_answer, '');
  assert.equal(row.answered_at, 'finish');
});
