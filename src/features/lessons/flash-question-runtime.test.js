import test from 'node:test';
import assert from 'node:assert/strict';
import { createFlashQuestionRuntime } from './flash-question-runtime.js';

test('Flash Question uses every lesson item exactly once', () => {
  const runtime = createFlashQuestionRuntime({
    items: [
      { question: 'Vraag 1', answer: 'Antwoord 1' },
      { question: 'Vraag 2', answer: 'Antwoord 2' },
      { question: 'Vraag 3', answer: 'Antwoord 3' }
    ],
    random: () => 0.5
  });

  const questions = [];
  runtime.start();
  questions.push(runtime.snapshot().item.question);

  let state = runtime.submitAnswer('Antwoord 1');
  runtime.continueGame();
  questions.push(runtime.snapshot().item.question);
  state = runtime.submitAnswer('Antwoord 2');
  runtime.continueGame();
  questions.push(runtime.snapshot().item.question);
  state = runtime.submitAnswer('Antwoord 3');

  assert.deepEqual(questions.sort(), ['Vraag 1', 'Vraag 2', 'Vraag 3']);
  assert.equal(state.phase, 'finished');
  assert.equal(state.score, 3);
  assert.equal(state.maxScore, 3);
});

test('correct answers earn one point and wrong answers earn zero without resetting the score', () => {
  const runtime = createFlashQuestionRuntime({
    items: [
      { question: 'Vraag 1', answer: 'Goed 1' },
      { question: 'Vraag 2', answer: 'Goed 2' },
      { question: 'Vraag 3', answer: 'Goed 3' }
    ],
    random: () => 0.5
  });

  runtime.start();
  const first = runtime.submitAnswer('Goed 1');
  assert.equal(first.score, 1);
  assert.equal(first.lastResult.delta, 1);

  runtime.continueGame();
  const second = runtime.submitAnswer('Fout');
  assert.equal(second.score, 1);
  assert.equal(second.lastResult.delta, 0);
  assert.equal(second.lastResult.correct, false);

  runtime.continueGame();
  const third = runtime.submitAnswer('Goed 3');
  assert.equal(third.score, 2);
});

test('each question contains its correct answer and up to three distractors', () => {
  const runtime = createFlashQuestionRuntime({
    items: [
      { question: 'Vraag 1', answer: 'Antwoord 1' },
      { question: 'Vraag 2', answer: 'Antwoord 2' },
      { question: 'Vraag 3', answer: 'Antwoord 3' },
      { question: 'Vraag 4', answer: 'Antwoord 4' },
      { question: 'Vraag 5', answer: 'Antwoord 5' }
    ],
    random: () => 0.5
  });

  runtime.start();
  const state = runtime.snapshot();
  assert.equal(state.item.options.length, 4);
  assert.ok(state.item.options.includes('Antwoord 1'));
  assert.equal(new Set(state.item.options).size, state.item.options.length);
});

test('an empty lesson finishes immediately', () => {
  const runtime = createFlashQuestionRuntime({ items: [] });
  const state = runtime.start();
  assert.equal(state.phase, 'finished');
  assert.equal(state.score, 0);
  assert.equal(state.maxScore, 0);
  assert.equal(state.item, null);
});

test('a result must be advanced explicitly before the next question', () => {
  const runtime = createFlashQuestionRuntime({
    items: [
      { question: 'Vraag 1', answer: 'Antwoord 1' },
      { question: 'Vraag 2', answer: 'Antwoord 2' }
    ]
  });

  runtime.start();
  runtime.submitAnswer('Antwoord 1');
  assert.throws(() => runtime.submitAnswer('Antwoord 2'), /Deze vraag kan nu niet worden beantwoord/);
  assert.equal(runtime.snapshot().phase, 'result');
  runtime.continueGame();
  assert.equal(runtime.snapshot().item.question, 'Vraag 2');
});
