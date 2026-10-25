import test from 'node:test';
import assert from 'node:assert/strict';
import { createMathQuestion, createMathSession, evaluateMathAnswer } from './math-domain.js';

const addition = { id: 'addition-custom', definition: { kind: 'math', operation: 'addition', operands: [{ min: 1, max: 10 }, { min: 20, max: 30 }], resultMax: 40 } };
const subtraction = { id: 'subtraction-custom', definition: { kind: 'math', operation: 'subtraction', operands: [{ min: 20, max: 100 }, { min: 1, max: 10 }] } };
const multiplication = { id: 'multiplication-custom', definition: { kind: 'math', operation: 'multiplication', operands: [{ min: 1, max: 10 }, { min: 50, max: 100 }] } };
const division = { id: 'division-custom', definition: { kind: 'math', operation: 'division', operands: [{ min: 10, max: 100 }, { min: 2, max: 10 }], remainderAllowed: false } };
const fractions = { id: 'fractions-custom', definition: { kind: 'math', operation: 'fraction', fractionOperation: 'addition', fractionOperands: [{ numerator: { min: 1, max: 1 }, denominator: { min: 2, max: 2 } }, { numerator: { min: 1, max: 4 }, denominator: { min: 4, max: 4 } }], simplifyAnswer: true } };

test('addition respects both operand ranges and result limit', () => {
  for (let i = 0; i < 100; i += 1) {
    const question = createMathQuestion(addition);
    assert.ok(question.a >= 1 && question.a <= 10);
    assert.ok(question.b >= 20 && question.b <= 30);
    assert.ok(question.answer <= 40);
  }
});

test('subtraction respects independent ranges and never produces a negative answer', () => {
  for (let i = 0; i < 100; i += 1) {
    const question = createMathQuestion(subtraction);
    assert.ok(question.a >= 20 && question.a <= 100);
    assert.ok(question.b >= 1 && question.b <= 10);
    assert.ok(question.answer >= 0);
  }
});

test('multiplication supports asymmetric operand ranges', () => {
  for (let i = 0; i < 100; i += 1) {
    const question = createMathQuestion(multiplication);
    assert.ok(question.a >= 1 && question.a <= 10);
    assert.ok(question.b >= 50 && question.b <= 100);
  }
});

test('division can generate exact questions from independent ranges', () => {
  for (let i = 0; i < 100; i += 1) {
    const question = createMathQuestion(division);
    assert.equal(question.a % question.b, 0);
    assert.ok(question.answer >= 1);
  }
});

test('fractions are structured and answers are reduced', () => {
  const question = createMathQuestion(fractions, () => 0);
  assert.equal(question.fractions[0].numerator, 1);
  assert.equal(question.fractions[0].denominator, 2);
  assert.deepEqual(question.answer, { numerator: 3, denominator: 4 });
  assert.equal(evaluateMathAnswer(question, '3/4').correct, true);
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
