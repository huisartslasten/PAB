import test from 'node:test';
import assert from 'node:assert/strict';
import { createMathQuestion, createMathSession, evaluateMathAnswer } from './math-domain.js';

test('addition generates a simple positive sum', () => {
  const question = createMathQuestion('addition', () => 0);
  assert.equal(question.operation, 'addition');
  assert.equal(question.a, 1);
  assert.equal(question.b, 1);
  assert.equal(question.answer, 2);
});

test('subtraction never generates a negative result', () => {
  for (let index = 0; index < 50; index += 1) {
    const question = createMathQuestion('subtraction');
    assert.ok(question.answer >= 0);
    assert.ok(question.a >= question.b);
  }
});

test('multiplication stays within the speed-practice range', () => {
  for (let index = 0; index < 50; index += 1) {
    const question = createMathQuestion('multiplication');
    assert.ok(question.a >= 2 && question.a <= 10);
    assert.ok(question.b >= 2 && question.b <= 10);
  }
});

test('mixed questions use one registered operation', () => {
  const question = createMathQuestion('mixed', () => 0.5);
  assert.ok(['addition', 'subtraction', 'multiplication'].includes(question.operation));
});

test('typed answer evaluation gives one point only for the exact answer', () => {
  const question = createMathQuestion('addition', () => 0);
  assert.deepEqual(evaluateMathAnswer(question, '2'), { correct: true, answered: true });
  assert.deepEqual(evaluateMathAnswer(question, '3'), { correct: false, answered: true });
  assert.deepEqual(evaluateMathAnswer(question, ''), { correct: false, answered: false });
});

test('math session keeps score and advances to a new question', () => {
  const session = createMathSession({ operation: 'addition', durationSeconds: 180, random: () => 0 });
  assert.equal(session.durationSeconds, 180);
  assert.equal(session.score, 0);
  assert.equal(session.answered, 0);

  const first = session.question;
  assert.equal(session.answer(String(first.answer)).correct, true);
  assert.equal(session.score, 1);
  assert.equal(session.answered, 1);
  assert.equal(session.correct, 1);

  const second = session.nextQuestion();
  assert.equal(session.question, second);
  assert.equal(session.answer(String(second.answer)).correct, true);
  assert.equal(session.score, 2);
});
