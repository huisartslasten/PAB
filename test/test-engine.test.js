import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestSession } from '../src/features/lessons/test-engine.js';

const exactEvaluator = async (_item, given) => ({
  correct: String(given).trim().toLowerCase() === 'appel'
});

test('test engine delegates answer evaluation and keeps session state', async () => {
  const session = createTestSession([{ question: 'Woord', answer: 'Appel' }], {
    type: 'words',
    evaluateAnswer: exactEvaluator,
    startedAt: '2026-10-07T00:00:00.000Z'
  });
  assert.equal((await session.submit(' appel ')).correct, true);
  assert.equal(session.result().correct, 1);
  assert.equal(session.type, 'words');
  assert.equal(session.kind, 'test');
});

test('test engine requires an answer evaluator', async () => {
  assert.throws(() => createTestSession([{ answer: 'appel' }], { type: 'words' }), /answer evaluator is required/);
});

test('test engine preserves evaluator result boundary for false answers', async () => {
  const session = createTestSession([{ answer: 'appel' }], {
    type: 'words',
    evaluateAnswer: exactEvaluator
  });
  assert.equal((await session.submit('peer')).correct, false);
  assert.equal(session.finished, true);
  assert.equal(session.result().score, 0);
});

test('test engine supports injected shuffle without owning evaluation', async () => {
  const session = createTestSession([
    { answer: 'peer' },
    { answer: 'appel' }
  ], {
    type: 'words',
    evaluateAnswer: exactEvaluator,
    shuffle: items => [...items].reverse()
  });
  assert.equal(session.currentItem().answer, 'appel');
  assert.equal((await session.submit('appel')).correct, true);
});
