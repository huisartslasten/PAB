import test from 'node:test';
import assert from 'node:assert/strict';
import { createMillionaireRuntime } from './runtime.js';

test('Millionaire uses lesson questions and keeps lifelines in game state', async () => {
  const runtime = createMillionaireRuntime({
    questions: [{ question: '2 + 2 = ?', answer: '4', answer_options: ['3', '4', '5', '6'] }],
    random: () => 0.1
  });

  runtime.start();
  await runtime.next();
  let state = runtime.snapshot();
  assert.equal(state.current.question, '2 + 2 = ?');
  assert.equal(state.options.includes('4'), true);
  assert.equal(state.lifelines.fiftyFifty, true);

  runtime.useFiftyFifty();
  state = runtime.snapshot();
  assert.equal(state.lifelines.fiftyFifty, false);
  assert.equal(state.options.includes('4'), true);

  runtime.choose('4');
  state = runtime.snapshot();
  assert.equal(state.finished, false);
  assert.equal(state.prize, 100);

  for (let question = 1; question < 11; question += 1) {
    await runtime.next();
    runtime.choose('4');
  }
  state = runtime.snapshot();
  assert.equal(state.finished, true);
  assert.equal(state.prize, 1000000);
});

test('Millionaire progresses from hard to harder challenge content', async () => {
  const calls = [];
  const runtime = createMillionaireRuntime({
    questions: [
      { question: 'Vraag 1', answer: 'A' },
      { question: 'Vraag 2', answer: 'B' }
    ],
    distractorService: {
      async generateMultipleChoiceDistractors(request) {
        calls.push(request.difficulty);
        return ['X', 'Y', 'Z'];
      }
    },
    random: () => 0.1
  });

  runtime.start();
  await runtime.next();
  assert.equal(runtime.snapshot().difficulty, 'hard');
  runtime.choose(runtime.snapshot().current.answer);
  await runtime.next();
  assert.equal(runtime.snapshot().difficulty, 'harder');
  assert.deepEqual(calls, ['hard', 'harder']);
});
