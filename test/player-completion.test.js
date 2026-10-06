import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayerCompletion } from '../src/features/lessons/player-completion.js';

test('completion derives counts and preserves test session metadata', () => {
  const result = createPlayerCompletion({
    lesson: { id: 12, student: 'Zyon', title: 'Themawoorden', type: 'words' },
    session: { startedAt: '2026-10-06T10:00:00Z', answers: [
      { value: 'a', correct: true },
      { value: 'b', correct: false }
    ] },
    finishedAt: '2026-10-06T10:03:00Z'
  });

  assert.equal(result.lessonId, 12);
  assert.equal(result.student, 'Zyon');
  assert.equal(result.total, 2);
  assert.equal(result.correct, 1);
  assert.equal(result.incorrect, 1);
  assert.equal(result.startedAt, '2026-10-06T10:00:00Z');
  assert.equal(result.finishedAt, '2026-10-06T10:03:00Z');
  assert.equal(result.isTest, true);
});

test('completion can use explicit answers instead of session answers', () => {
  const result = createPlayerCompletion({
    lesson: { id: 3, type: 'dictation' },
    session: { startedAt: 'start', answers: [{ correct: true }] },
    answers: [{ correct: false }, { correct: true }],
    finishedAt: 'finish'
  });

  assert.equal(result.total, 2);
  assert.equal(result.correct, 1);
  assert.equal(result.answers.length, 2);
});

test('completion is defensive for missing inputs', () => {
  const result = createPlayerCompletion();
  assert.equal(result.total, 0);
  assert.equal(result.correct, 0);
  assert.equal(result.incorrect, 0);
  assert.equal(result.lessonId, null);
  assert.equal(result.isTest, true);
});
