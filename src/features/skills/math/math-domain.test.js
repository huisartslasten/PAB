import test from 'node:test';
import assert from 'node:assert/strict';
import { createMathQuestion, createMathSession, createMixedMathQuestion, evaluateMathAnswer } from './math-domain.js';

test('addition easy profile generates a result within its profile', () => {
  const question = createMathQuestion('addition-easy', () => 0);
  assert.equal(question.operation, 'addition');
  assert.equal(question.profileId, 'addition-easy');
  assert.equal(question.a, 1);
  assert.equal(question.b, 1);
  assert.equal(question.answer, 2);
  assert.ok(question.answer <= 20);
});

test('addition 1.000 profile can generate larger sums without exceeding its result limit', () => {
  const question = createMathQuestion('addition-1000', () => 0.999);
  assert.equal(question.operation, 'addition');
  assert.ok(question.answer <= 1000);
  assert.ok(question.answer > 100);
});

test('subtraction profiles never generate a negative result', () => {
  for (let index = 0; index < 50; index += 1) {
    const question = createMathQuestion('subtraction-1000');
    assert.ok(question.answer >= 0);
    assert.ok(question.answer <= 1000);
    assert.ok(question.a >= question.b);
  }
});

test('multiplication profiles stay within their configured factor range', () => {
  for (let index = 0; index < 50; index += 1) {
    const question = createMathQuestion('multiplication-1-10');
    assert.ok(question.a >= 1 && question.a <= 10);
    assert.ok(question.b >= 1 && question.b <= 10);
  }
});

test('mixed questions use one selected profile', () => {
  const question = createMixedMathQuestion(['addition-easy', 'multiplication-1-10'], () => 0);
  assert.ok(['addition-easy', 'multiplication-1-10'].includes(question.profileId));
});

test('typed answer evaluation gives one point only for the exact answer', () => {
  const question = createMathQuestion('addition-easy', () => 0);
  assert.deepEqual(evaluateMathAnswer(question, '2'), { correct: true, answered: true });
  assert.deepEqual(evaluateMathAnswer(question, '3'), { correct: false, answered: true });
  assert.deepEqual(evaluateMathAnswer(question, ''), { correct: false, answered: false });
});

test('math session keeps score and advances to a new question', () => {
  const session = createMathSession({ profileId: 'addition-easy', durationSeconds: 180, random: () => 0 });
  assert.equal(session.durationSeconds, 180);
  assert.equal(session.score, 0);
  assert.equal(session.answered, 0);
  assert.equal(session.profileId, 'addition-easy');

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
