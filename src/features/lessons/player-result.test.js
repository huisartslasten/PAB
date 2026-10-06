import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerResult } from './player-result.js';


test('player result keeps presentation grade separate from persistence score', () => {
  const result = createPlayerResult({
    lesson: { id: 123, title: 'Themawoorden' },
    type: 'words',
    mode: 'test',
    answers: [
      { item: { question: 'A', answer: '1' }, value: '1', correct: true },
      { item: { question: 'B', answer: '2' }, value: '3', correct: false },
      { item: { question: 'C', answer: '4' }, value: '4', correct: true }
    ],
    startedAt: '2026-10-06T20:00:00.000Z',
    finishedAt: '2026-10-06T20:05:00.000Z'
  });

  // V4.78 persistence score = number correct.
  assert.equal(result.correct, 2);
  assert.equal(result.total, 3);

  // V4.78 presentation score = grade on a 1–10 scale.
  assert.equal(result.score, 6.7);
});
