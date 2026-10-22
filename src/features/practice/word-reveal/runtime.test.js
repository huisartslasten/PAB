import test from 'node:test';
import assert from 'node:assert/strict';
import { createWordRevealRuntime } from './runtime.js';

const target = { type: 'word', text: 'boom', meaning: '' };

function createRuntime(items = [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }]) {
  return createWordRevealRuntime({
    items,
    gradeAnswer: async (question, answer, value) => ({ correct: answer === String(value ?? '') }),
    random: () => 0
  });
}

test('wrong answer stays open and the same question can be answered later', async () => {
  const runtime = createRuntime();
  runtime.startRound(target);
  const first = runtime.snapshot().current;

  await runtime.submitAnswer('fout');
  assert.equal(runtime.snapshot().remainingCount, 2);
  assert.equal(runtime.snapshot().current.index, first.index);
  assert.equal(runtime.snapshot().turns, 0);
  assert.equal(runtime.snapshot().feedback.correct, false);

  runtime.continueAfterFeedback();
  assert.equal(runtime.snapshot().current?.index, 1 - first.index);
  await runtime.submitAnswer(runtime.snapshot().current.answer);
  assert.equal(runtime.snapshot().remainingCount, 1);
  assert.equal(runtime.snapshot().revealedCount, 1);
  assert.equal(runtime.snapshot().turns, 1);
  assert.equal(runtime.snapshot().completedCount, 1);
});

test('questions are the completion source of truth even when the target is longer', async () => {
  const runtime = createRuntime([{ question: 'q1', answer: 'a1' }]);
  runtime.startRound({ type: 'sentence', text: 'Leren is leuk', meaning: '' });
  await runtime.submitAnswer('a1');
  const state = runtime.snapshot();
  assert.equal(state.phase, 'finished');
  assert.equal(state.remainingCount, 0);
  assert.equal(state.revealedCount, state.target.revealableIndices.length);
  assert.equal(state.turns, 1);
});

test('solving the target before all lesson questions starts another round', async () => {
  const runtime = createRuntime();
  runtime.startRound({ type: 'word', text: 'ab', meaning: '' });
  await runtime.submitAnswer('a1');
  assert.equal(runtime.snapshot().phase, 'question');
  await runtime.submitAnswer('a2');
  assert.equal(runtime.snapshot().phase, 'round-complete');
  assert.equal(runtime.snapshot().remainingCount, 0);
});

test('whole-solution guess always costs one turn', () => {
  const runtime = createRuntime();
  runtime.startRound(target);
  const afterWrongGuess = runtime.guessSolution('ander woord');
  assert.equal(afterWrongGuess.turns, 1);
  assert.equal(afterWrongGuess.phase, 'question');
  assert.equal(afterWrongGuess.remainingCount, 2);

  const afterCorrectGuess = runtime.guessSolution('boom');
  assert.equal(afterCorrectGuess.turns, 2);
  assert.equal(afterCorrectGuess.phase, 'round-complete');
  assert.equal(afterCorrectGuess.remainingCount, 2);
});
