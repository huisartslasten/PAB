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
  assert.equal(state.finished, true);
  assert.equal(state.prize, 100);
});
