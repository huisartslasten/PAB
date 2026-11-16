import test from 'node:test';
import assert from 'node:assert/strict';
import { createDoubleOrNothingRuntime, FIRST_REWARD, maxScoreFor } from '../src/features/practice/double-or-nothing/runtime.js';

test('Double or Nothing rejects an empty answer without locking the question', async () => {
  let gradingCalls = 0;
  const runtime = createDoubleOrNothingRuntime({
    items: [{ question: '2 + 2 = ?', answer: '4' }],
    gradeAnswer: async () => {
      gradingCalls += 1;
      return { correct: true };
    }
  });

  runtime.start();
  await assert.rejects(() => runtime.submitAnswer('   '), /Vul eerst een antwoord in/);
  assert.equal(gradingCalls, 0);
  assert.equal(runtime.snapshot().phase, 'question');
  assert.equal(runtime.snapshot().score, 0);
  assert.equal(runtime.snapshot().index, 0);
});

test('Double or Nothing can be checked normally after an empty answer attempt', async () => {
  const runtime = createDoubleOrNothingRuntime({
    items: [{ question: '2 + 2 = ?', answer: '4' }, { question: '3 + 3 = ?', answer: '6' }],
    gradeAnswer: async (_question, _expected, given) => ({ correct: given === '4' })
  });

  runtime.start();
  await assert.rejects(() => runtime.submitAnswer(''), /Vul eerst een antwoord in/);
  const result = await runtime.submitAnswer('4');

  assert.equal(result.phase, 'result');
  assert.equal(result.score, FIRST_REWARD);
  assert.equal(result.index, 1);
  assert.equal(result.lastResult.givenAnswer, '4');
});

test('Double or Nothing keeps the existing scoring contract', () => {
  assert.equal(maxScoreFor(0), 0);
  assert.equal(maxScoreFor(1), 10);
  assert.equal(maxScoreFor(4), 80);
});
