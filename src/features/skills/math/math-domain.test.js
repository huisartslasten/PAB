import test from 'node:test';
import assert from 'node:assert/strict';
import { createMathQuestion, createMathSession, evaluateMathAnswer } from './math-domain.js';

const addition = { id: 'addition-100', definition: { kind: 'math', operation: 'addition', operandMin: 1, resultMax: 100 } };
const subtraction = { id: 'subtraction-100', definition: { kind: 'math', operation: 'subtraction', operandMin: 0, resultMax: 100 } };
const multiplication = { id: 'multiplication-1-10', definition: { kind: 'math', operation: 'multiplication', factorMin: 1, factorMax: 10 } };

test('addition stays within configured result range', () => {
  for (let i = 0; i < 100; i += 1) {
    const question = createMathQuestion(addition);
    assert.equal(question.operation, 'addition');
    assert.ok(question.answer <= 100);
  }
});

test('subtraction never produces a negative answer', () => {
  for (let i = 0; i < 100; i += 1) assert.ok(createMathQuestion(subtraction).answer >= 0);
});

test('multiplication respects configured factor range', () => {
  for (let i = 0; i < 100; i += 1) {
    const question = createMathQuestion(multiplication);
    assert.ok(question.a >= 1 && question.a <= 10);
    assert.ok(question.b >= 1 && question.b <= 10);
  }
});

test('typed answer evaluation is exact and blanks are not answers', () => {
  const question = createMathQuestion(addition, () => 0);
  assert.deepEqual(evaluateMathAnswer(question, ''), { correct: false, answered: false });
  assert.equal(evaluateMathAnswer(question, question.answer).correct, true);
});

test('session scores correct answers and exposes configured duration', () => {
  const session = createMathSession({ durationSeconds: 60, profile: addition, random: () => 0 });
  assert.equal(session.durationSeconds, 60);
  const first = session.question;
  assert.equal(session.answer(first.answer).correct, true);
  session.nextQuestion();
  assert.equal(session.score, 1);
  assert.equal(session.answered, 1);
});
