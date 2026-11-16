import test from 'node:test';
import assert from 'node:assert/strict';
import { createRockPaperScissorsRuntime, getRpsResult, getRpsScore, ROCK_PAPER_SCISSORS_CHOICES } from '../src/features/practice/rock-paper-scissors/runtime.js';

test('Rock Paper Scissors uses answer feedback before the RPS choice', () => {
  const runtime = createRockPaperScissorsRuntime({
    items: [
      { id: 1, question: '2 + 2', answer: '4' },
      { id: 2, question: 'Hoofdstad van Frankrijk?', answer: 'Parijs' }
    ],
    random: () => 0
  });

  let state = runtime.start();
  assert.equal(state.phase, 'question');
  assert.ok(ROCK_PAPER_SCISSORS_CHOICES.includes(state.pacoChoice));
  assert.equal(state.pacoChoice, 'rock');
  assert.equal(state.maxScore, 4);

  state = runtime.submitAnswer('4');
  assert.equal(state.phase, 'feedback');
  assert.equal(state.score, 0);
  assert.equal(state.lastResult.correct, true);

  state = runtime.continueAfterFeedback();
  assert.equal(state.phase, 'choice');
  assert.equal(state.score, 0);

  state = runtime.choose('rock');
  assert.equal(state.phase, 'reveal');

  state = runtime.reveal();
  assert.equal(state.phase, 'result');
  assert.equal(state.lastResult.rpsResult, 'draw');
  assert.equal(state.lastResult.delta, 1);
  assert.equal(state.score, 1);

  state = runtime.continueGame();
  assert.equal(state.phase, 'question');
});

test('The final question still shows the result before the round finishes', () => {
  const runtime = createRockPaperScissorsRuntime({
    items: [{ question: '1 + 1', answer: '2' }],
    random: () => 0
  });

  runtime.start();
  runtime.submitAnswer('2');
  runtime.continueAfterFeedback();
  runtime.choose('rock');

  const revealed = runtime.reveal();
  assert.equal(revealed.phase, 'result');
  assert.equal(revealed.lastResult.rpsResult, 'draw');
  assert.equal(revealed.score, 1);

  const finished = runtime.continueGame();
  assert.equal(finished.phase, 'finished');
});

test('A wrong answer gives no RPS opportunity and the question is requeued', () => {
  const runtime = createRockPaperScissorsRuntime({
    items: [
      { id: 1, question: '1 + 1', answer: '2' },
      { id: 2, question: '2 + 2', answer: '4' }
    ],
    random: () => 0
  });

  runtime.start();
  const firstQuestion = runtime.snapshot().item.id;
  runtime.submitAnswer('wrong');
  let state = runtime.snapshot();
  assert.equal(state.phase, 'feedback');
  assert.equal(state.score, 0);
  assert.equal(state.lastResult.correct, false);
  assert.equal(state.lastResult.expectedAnswer, firstQuestion === '1' ? '2' : '4');

  state = runtime.continueAfterFeedback();
  assert.equal(state.phase, 'question');
  assert.notEqual(state.item.id, firstQuestion);

  runtime.submitAnswer(state.item.answer);
  state = runtime.continueAfterFeedback();
  assert.equal(state.phase, 'choice');
});

test('RPS outcome rules award 2 for a win, 1 for a draw and 0 for a loss', () => {
  assert.equal(getRpsResult('rock', 'scissors'), 'win');
  assert.equal(getRpsResult('paper', 'rock'), 'win');
  assert.equal(getRpsResult('scissors', 'paper'), 'win');
  assert.equal(getRpsResult('rock', 'rock'), 'draw');
  assert.equal(getRpsResult('rock', 'paper'), 'loss');
  assert.equal(getRpsScore('win'), 2);
  assert.equal(getRpsScore('draw'), 1);
  assert.equal(getRpsScore('loss'), 0);
});

test('The RPS score is awarded only after the reveal', () => {
  const runtime = createRockPaperScissorsRuntime({
    items: [{ question: '1 + 1', answer: '2' }],
    random: () => 0
  });

  runtime.start();
  runtime.submitAnswer('2');
  runtime.continueAfterFeedback();
  runtime.choose('paper');
  assert.equal(runtime.snapshot().score, 0);

  runtime.reveal();
  assert.equal(runtime.snapshot().score, 0);
});
