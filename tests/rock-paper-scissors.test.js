import test from 'node:test';
import assert from 'node:assert/strict';
import { createRockPaperScissorsRuntime, getRpsResult, ROCK_PAPER_SCISSORS_CHOICES } from '../src/features/practice/rock-paper-scissors/runtime.js';

test('Rock Paper Scissors uses the canonical answer -> choice -> reveal sequence', () => {
  const randomValues = [0, 0.99, 0.5, 0.25, 0.75, 0.1];
  let index = 0;
  const random = () => randomValues[index++ % randomValues.length];
  const runtime = createRockPaperScissorsRuntime({
    items: [
      { id: 1, question: '2 + 2', answer: '4' },
      { id: 2, question: 'Hoofdstad van Frankrijk?', answer: 'Parijs' }
    ],
    random
  });

  let state = runtime.start();
  assert.equal(state.phase, 'question');
  assert.ok(ROCK_PAPER_SCISSORS_CHOICES.includes(state.pacoChoice));

  state = runtime.submitAnswer('4');
  assert.equal(state.phase, 'choice');
  assert.equal(state.score, 1);
  assert.equal(state.lastResult.correct, true);

  state = runtime.choose('rock');
  assert.equal(state.phase, 'reveal');
  assert.equal(state.playerChoice, 'rock');
  assert.equal(state.pacoChoice, 'rock');

  state = runtime.reveal();
  assert.equal(state.phase, 'result');
  assert.equal(state.lastResult.rpsResult, 'draw');

  state = runtime.continueGame();
  assert.equal(state.phase, 'question');
});

test('A wrong answer scores zero while the RPS result is still revealed', () => {
  const runtime = createRockPaperScissorsRuntime({
    items: [{ question: '1 + 1', answer: '2' }],
    random: () => 0
  });

  runtime.start();
  runtime.submitAnswer('3');
  const state = runtime.choose('paper');
  assert.equal(state.phase, 'reveal');
  assert.equal(state.score, 0);

  const revealed = runtime.reveal();
  assert.equal(revealed.phase, 'finished');
  assert.equal(revealed.score, 0);
  assert.equal(revealed.lastResult.correct, false);
  assert.equal(revealed.lastResult.rpsResult, 'win');
});

test('RPS outcome rules are deterministic', () => {
  assert.equal(getRpsResult('rock', 'scissors'), 'win');
  assert.equal(getRpsResult('paper', 'rock'), 'win');
  assert.equal(getRpsResult('scissors', 'paper'), 'win');
  assert.equal(getRpsResult('rock', 'rock'), 'draw');
  assert.equal(getRpsResult('rock', 'paper'), 'loss');
});
