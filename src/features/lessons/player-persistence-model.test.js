import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildTestAttemptRow,
  buildTestAttemptAnswerRows
} from './player-persistence-model.js';

test('buildTestAttemptRow preserves the V4.78 test-attempt contract', () => {
  assert.deepEqual(
    buildTestAttemptRow({
      lessonId: 'lesson-123',
      student: ' Zyon ',
      correct: 2,
      total: 3,
      startedAt: '2026-10-06T20:00:00.000Z',
      completedAt: '2026-10-06T20:02:00.000Z',
      isTest: true
    }),
    {
      lesson_id: 'lesson-123',
      student: 'Zyon',
      score: 2,
      total_questions: 3,
      started_at: '2026-10-06T20:00:00.000Z',
      completed_at: '2026-10-06T20:02:00.000Z',
      is_test: true
    }
  );
});

test('buildTestAttemptAnswerRows uses one-based order and completion timestamp', () => {
  const finishedAt = '2026-10-06T20:02:00.000Z';

  assert.deepEqual(
    buildTestAttemptAnswerRows([
      {
        item: { question: 'kat', answer: 'cat' },
        value: 'cat',
        correct: true
      },
      {
        item: { question: 'hond', answer: 'dog' },
        value: '',
        correct: false
      }
    ], { finishedAt, questionType: 'words' }),
    [
      {
        question_order: 1,
        question: 'kat',
        expected_answer: 'cat',
        given_answer: 'cat',
        is_correct: true,
        question_type: 'words',
        answered_at: finishedAt
      },
      {
        question_order: 2,
        question: 'hond',
        expected_answer: 'dog',
        given_answer: '',
        is_correct: false,
        question_type: 'words',
        answered_at: finishedAt
      }
    ]
  );
});

test('buildTestAttemptAnswerRows keeps empty answers as empty strings', () => {
  assert.deepEqual(
    buildTestAttemptAnswerRows([
      { item: {}, value: '', correct: false }
    ], { finishedAt: '2026-10-06T20:02:00.000Z', questionType: 'text' }),
    [{
      question_order: 1,
      question: '',
      expected_answer: '',
      given_answer: '',
      is_correct: false,
      question_type: 'text',
      answered_at: '2026-10-06T20:02:00.000Z'
    }]
  );
});
