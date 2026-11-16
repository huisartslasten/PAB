import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTestAttemptRow,
  buildTestAttemptAnswerRows,
  buildTestPersistencePayload
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

test('answer rows match V4.78 order, values and type', () => {
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
  ], { questionType: 'text' });

  assert.deepEqual(rows, [
    {
      question_order: 1,
      question: 'Capital of France?',
      expected_answer: 'Paris',
      given_answer: 'Paris',
      is_correct: true,
      question_type: 'text'
    },
    {
      question_order: 2,
      question: '2 + 2',
      expected_answer: '4',
      given_answer: '5',
      is_correct: false,
      question_type: 'math'
    }
  ]);
});

test('V4.78 persists empty expected and given answers as empty strings', () => {
  const [row] = buildTestAttemptAnswerRows([{
    question: 'Vraag',
    value: '',
    expected: '',
    correct: false
  }]);

  assert.equal(row.question, 'Vraag');
  assert.equal(row.expected_answer, '');
  assert.equal(row.given_answer, '');
});

test('attempt contract maps directly to the two V4.78 persistence row groups', () => {
  const payload = buildTestPersistencePayload({
    lessonId: 7,
    student: 'Zyon',
    type: 'dictation',
    startedAt: '2026-10-05T10:00:00.000Z',
    finishedAt: '2026-10-05T10:05:00.000Z',
    answers: [
      { item: { question: 'fiets', answer: 'fiets' }, value: 'fiets', correct: true },
      { item: { question: 'huis', answer: 'huis' }, value: 'woning', correct: false }
    ]
  });

  assert.deepEqual(payload.attempt, {
    lesson_id: 7,
    student: 'Zyon',
    score: 1,
    total_questions: 2,
    started_at: '2026-10-05T10:00:00.000Z',
    completed_at: '2026-10-05T10:05:00.000Z',
    is_test: true
  });
  assert.deepEqual(payload.answers, [
    {
      question_order: 1,
      question: 'fiets',
      expected_answer: 'fiets',
      given_answer: 'fiets',
      is_correct: true,
      question_type: 'dictation'
    },
    {
      question_order: 2,
      question: 'huis',
      expected_answer: 'huis',
      given_answer: 'woning',
      is_correct: false,
      question_type: 'dictation'
    }
  ]);
});
