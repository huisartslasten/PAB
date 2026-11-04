import test from 'node:test';
import assert from 'node:assert/strict';
import { createDoubleOrNothingRuntime } from './runtime.js';

const items = [
  { question: 'Vraag 1', answer: 'Antwoord 1' },
  { question: 'Vraag 2', answer: 'Antwoord 2' },
  { question: 'Vraag 3', answer: 'Antwoord 3' }
];

const gradeAnswer = async (_question, expected, value) => ({
  correct: expected === value,
  feedback: ''
});

test('Double or Nothing numbers shuffled questions by round order, not source index', async () => {
  const runtime = createDoubleOrNothingRuntime({ items, gradeAnswer, random: () => 0 });
  const first = runtime.start();

  assert.equal(first.index, 0);
  assert.equal(first.item.question, 'Vraag 3');
  assert.throws(() => runtime.chooseStake(10), /eerste vraag heeft geen inzet/i);

  const firstResult = await runtime.submitAnswer('Antwoord 3');
  assert.equal(firstResult.lastResult.stake, 10);
  assert.equal(firstResult.score, 10);
  assert.equal(firstResult.index, 1);

  const second = runtime.continueGame();
  assert.equal(second.index, 1);
  assert.equal(second.item.question, 'Vraag 2');
  runtime.chooseStake(10);
  const secondResult = await runtime.submitAnswer('Antwoord 2');
  assert.equal(secondResult.score, 20);
});

test('a wrong first answer is followed by the normal free recovery question', async () => {
  const runtime = createDoubleOrNothingRuntime({ items, gradeAnswer, random: () => 0 });
  runtime.start();

  const firstResult = await runtime.submitAnswer('fout');
  assert.equal(firstResult.score, 0);

  const next = runtime.continueGame();
  assert.equal(next.index, 1);
  assert.equal(next.score, 0);
  assert.throws(() => runtime.chooseStake(1), /0 botjes/i);

  const recovery = await runtime.submitAnswer('Antwoord 2');
  assert.equal(recovery.lastResult.stake, 10);
  assert.equal(recovery.score, 10);
});
