import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuestionSession } from '../src/features/lessons/question-session.js';

test('question session shuffles once and preserves every lesson item', () => {
  const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const session = createQuestionSession(items, { random: () => 0 });

  assert.deepEqual(session.getState(), {
    index: 0,
    total: 3,
    current: { id: 2 },
    complete: false
  });
  assert.deepEqual(session.next(), { id: 3 });
  assert.deepEqual(session.next(), { id: 1 });
  assert.equal(session.next(), null);
  assert.equal(session.getState().complete, true);
});

test('question session does not mutate the lesson item array', () => {
  const items = [{ id: 1 }, { id: 2 }];
  const original = [...items];
  const session = createQuestionSession(items, { random: () => 0.99 });

  session.next();
  assert.deepEqual(items, original);
});

test('empty question sessions are complete immediately', () => {
  const session = createQuestionSession([]);

  assert.equal(session.current(), null);
  assert.deepEqual(session.getState(), {
    index: 0,
    total: 0,
    current: null,
    complete: true
  });
});
