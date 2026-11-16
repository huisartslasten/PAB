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
  assert.notEqual(runtime.snapshot().current?.index, first.index);
  await runtime.submitAnswer(runtime.snapshot().current.answer);
  assert.equal(runtime.snapshot().remainingCount, 1);
  assert.equal(runtime.snapshot().revealedCount, 0);
  assert.equal(runtime.snapshot().turns, 1);
  assert.equal(runtime.snapshot().phase, 'reveal-choice');
  assert.equal(runtime.snapshot().completedCount, 1);
});

test('a correct answer opens exactly one letter choice and reveals the selected position', async () => {
  const runtime = createRuntime();
  runtime.startRound(target);
  await runtime.submitAnswer(runtime.snapshot().current.answer);

  const stateBeforeReveal = runtime.snapshot();
  assert.equal(stateBeforeReveal.phase, 'reveal-choice');
  assert.equal(stateBeforeReveal.revealedCount, 0);
  assert.deepEqual(stateBeforeReveal.revealedIndices, []);

  const selectedIndex = stateBeforeReveal.target.revealableIndices.at(-1);
  runtime.revealLetter(selectedIndex);
  const stateAfterReveal = runtime.snapshot();
  assert.equal(stateAfterReveal.revealedCount, 1);
  assert.deepEqual(stateAfterReveal.revealedIndices, [selectedIndex]);
  assert.equal(stateAfterReveal.phase, 'question');
});

test('questions are the completion source of truth even when the target is longer', async () => {
  const runtime = createRuntime([{ question: 'q1', answer: 'a1' }]);
  runtime.startRound({ type: 'sentence', text: 'Leren is leuk', meaning: '' });
  await runtime.submitAnswer('a1');
  assert.equal(runtime.snapshot().phase, 'reveal-choice');
  runtime.revealLetter(runtime.snapshot().target.revealableIndices[0]);
  const state = runtime.snapshot();
  assert.equal(state.phase, 'finished');
  assert.equal(state.remainingCount, 0);
  assert.equal(state.revealedCount, state.target.revealableIndices.length);
  assert.equal(state.turns, 1);
});

test('solving the target before all lesson questions starts another round', async () => {
  const runtime = createRuntime([
    { question: 'q1', answer: 'a1' },
    { question: 'q2', answer: 'a2' },
    { question: 'q3', answer: 'a3' }
  ]);
  runtime.startRound({ type: 'word', text: 'ab', meaning: '' });

  const firstQuestion = runtime.snapshot().current;
  await runtime.submitAnswer(firstQuestion.answer);
  runtime.revealLetter(runtime.snapshot().target.revealableIndices[0]);
  assert.equal(runtime.snapshot().phase, 'question');

  const secondQuestion = runtime.snapshot().current;
  await runtime.submitAnswer(secondQuestion.answer);
  assert.equal(runtime.snapshot().phase, 'reveal-choice');
  runtime.revealLetter(runtime.snapshot().target.revealableIndices[1]);
  assert.equal(runtime.snapshot().phase, 'round-complete');
  assert.equal(runtime.snapshot().remainingCount, 1);
});

test('whole-solution guess always costs one turn without revealing the solution when wrong', () => {
  const runtime = createRuntime();
  runtime.startRound(target);
  const afterWrongGuess = runtime.guessSolution('sportend');
  assert.equal(afterWrongGuess.turns, 1);
  assert.equal(afterWrongGuess.phase, 'question');
  assert.equal(afterWrongGuess.remainingCount, 2);
  assert.equal(afterWrongGuess.feedback.correct, false);
  assert.equal(afterWrongGuess.feedback.correctAnswer, undefined);
  assert.equal(afterWrongGuess.revealedCount, 0);

  runtime.continueAfterFeedback();
  const afterCorrectGuess = runtime.guessSolution('boom');
  assert.equal(afterCorrectGuess.turns, 2);
  assert.equal(afterCorrectGuess.phase, 'round-complete');
  assert.equal(afterCorrectGuess.remainingCount, 2);
  assert.equal(afterCorrectGuess.revealedCount, afterCorrectGuess.target.revealableIndices.length);
});
