import test from 'node:test';
import assert from 'node:assert/strict';
import { createDoubleOrNothingRuntime, maxScoreFor } from './double-or-nothing-runtime.js';

test('first correct answer earns 10 bones without a stake', async () => {
  const runtime = createDoubleOrNothingRuntime({
    items: [{ question: '1+1', answer: '2' }, { question: '2+2', answer: '4' }],
    gradeAnswer: async (_question, expected, given) => ({ correct: expected === given })
  });

  runtime.start();
  const state = await runtime.submitAnswer('2');

  assert.equal(state.score, 10);
  assert.equal(state.lastResult.delta, 10);
  assert.equal(state.phase, 'result');
});

test('a correct stake adds the stake and a wrong stake subtracts it', async () => {
  const runtime = createDoubleOrNothingRuntime({
    items: [
      { question: '1+1', answer: '2' },
      { question: '2+2', answer: '4' },
      { question: '3+3', answer: '6' }
    ],
    gradeAnswer: async (_question, expected, given) => ({ correct: expected === given })
  });

  runtime.start();
  await runtime.submitAnswer('2');
  runtime.continueGame();
  runtime.chooseStake(10);
  const correct = await runtime.submitAnswer('4');
  assert.equal(correct.score, 20);

  runtime.continueGame();
  runtime.chooseStake(20);
  const wrong = await runtime.submitAnswer('wrong');
  assert.equal(wrong.score, 0);
  assert.equal(wrong.lastResult.delta, -20);
});

test('maximum possible score doubles after every correct question after the free first question', () => {
  assert.equal(maxScoreFor(0), 0);
  assert.equal(maxScoreFor(1), 10);
  assert.equal(maxScoreFor(2), 20);
  assert.equal(maxScoreFor(5), 160);
});
