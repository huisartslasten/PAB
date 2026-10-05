import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLessonScore, buildTestResult } from '../src/features/lessons/results.js';

test('lesson score uses the existing one-decimal test scale', () => {
  assert.equal(calculateLessonScore(9, 10), 9);
  assert.equal(calculateLessonScore(7, 9), 7.8);
  assert.equal(calculateLessonScore(0, 0), 0);
});

test('lesson result preserves answer details', () => {
  const answers = [{ item: { id: 1 }, value: 'kat', correct: true }, { item: { id: 2 }, value: 'paard', correct: false }];
  const result = buildTestResult(answers);
  assert.equal(result.correct, 1);
  assert.equal(result.total, 2);
  assert.equal(result.score, 5);
  assert.deepEqual(result.answers, answers);
});
