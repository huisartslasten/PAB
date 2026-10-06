import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayerCompletionPackage } from '../src/features/lessons/player-completion-package.js';

test('completion package separates database score from presentation grade', () => {
  const pkg = createPlayerCompletionPackage({
    lessonId: 8,
    student: 'Zyon',
    lessonTitle: 'Woorden',
    type: 'words',
    total: 4,
    correct: 3,
    answers: [
      { item: { id: 1, question: 'q1', answer: 'a' }, value: 'a', correct: true, questionType: 'words' },
      { item: { id: 2, question: 'q2', answer: 'b' }, value: 'x', correct: false, questionType: 'words' },
      { item: { id: 3, question: 'q3', answer: 'c' }, value: 'c', correct: true, questionType: 'words' },
      { item: { id: 4, question: 'q4', answer: 'd' }, value: 'd', correct: true, questionType: 'words' }
    ],
    startedAt: 'start',
    finishedAt: 'finish'
  });

  assert.equal(pkg.attempt.score, 3);
  assert.equal(pkg.attempt.total_questions, 4);
  assert.equal(pkg.result.score, 7.5);
  assert.equal(pkg.answerRows.length, 4);
  assert.equal(pkg.answerRows[1].given_answer, 'x');
  assert.equal(pkg.answerRows[1].expected_answer, 'b');
});

test('completion package preserves dictation result title through result model', () => {
  const pkg = createPlayerCompletionPackage({
    lessonId: 9,
    lessonTitle: 'Dictee',
    type: 'dictation',
    answers: [{ item: { question: 'q', answer: 'a' }, value: 'a', correct: true }]
  });

  assert.equal(pkg.result.title, '✏️ Dictee klaar!');
});
