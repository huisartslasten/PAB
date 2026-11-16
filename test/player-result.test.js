import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayerResult } from '../src/features/lessons/player-result.js';

test('V4.78 result uses a one-decimal grade on a 1-to-10 scale', () => {
  const result = createPlayerResult({
    lesson: { id: 12, title: 'Themawoorden' },
    type: 'words',
    answers: [
      { item: { id: 1, question: 'a', answer: 'A' }, value: 'A', correct: true },
      { item: { id: 2, question: 'b', answer: 'B' }, value: 'X', correct: false },
      { item: { id: 3, question: 'c', answer: 'C' }, value: 'C', correct: true }
    ],
    startedAt: '2026-10-05T10:00:00.000Z',
    finishedAt: '2026-10-05T10:02:00.000Z'
  });

  assert.equal(result.lessonId, 12);
  assert.equal(result.lessonTitle, 'Themawoorden');
  assert.equal(result.total, 3);
  assert.equal(result.correct, 2);
  assert.equal(result.incorrect, 1);
  assert.equal(result.score, 6.7);
  assert.equal(result.title, '📝 Toets klaar!');
});

test('V4.78 dictation result has the dictation completion title', () => {
  const result = createPlayerResult({
    lesson: { id: 7, title: 'Dictee' },
    type: 'dictation',
    answers: [
      { item: { id: 1, question: 'fiets', answer: 'fiets' }, value: 'fiets', correct: true }
    ]
  });

  assert.equal(result.score, 10);
  assert.equal(result.title, '✏️ Dictee klaar!');
});

test('result keeps the learner answer and expected answer separately', () => {
  const result = createPlayerResult({
    lesson: { id: 1, title: 'Woorden' },
    answers: [
      { item: { id: 9, question: 'Vraag', answer: 'Goed antwoord' }, value: 'Mijn antwoord', correct: false }
    ]
  });

  assert.deepEqual(result.answers, [{
    itemId: 9,
    question: 'Vraag',
    value: 'Mijn antwoord',
    expected: 'Goed antwoord',
    correct: false,
    feedback: ''
  }]);
});

test('result preserves whitespace exactly as V4.78 renders it', () => {
  const result = createPlayerResult({
    answers: [
      { item: { question: '  Vraag  ', answer: '  Goed  ' }, value: '  Mijn antwoord  ', correct: false }
    ]
  });

  assert.equal(result.answers[0].question, '  Vraag  ');
  assert.equal(result.answers[0].value, '  Mijn antwoord  ');
  assert.equal(result.answers[0].expected, '  Goed  ');
});

test('empty result has no division error', () => {
  const result = createPlayerResult({ answers: [] });
  assert.equal(result.total, 0);
  assert.equal(result.correct, 0);
  assert.equal(result.score, 0);
});
