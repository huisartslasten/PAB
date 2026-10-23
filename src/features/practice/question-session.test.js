import test from 'node:test';
import assert from 'node:assert/strict';
import { createPracticeQuestionSession } from './question-session.js';

const items = [
  { question: 'A', answer: 'a' },
  { question: 'B', answer: 'b' },
  { question: 'C', answer: 'c' },
  { question: 'D', answer: 'd' },
  { question: 'E', answer: 'e' }
];

test('shared question session retries a wrong question after the remaining first-pass questions', () => {
  const session = createPracticeQuestionSession(items, { random: () => 0.5 });
  const seen = [];
  for (let index = 0; index < 5; index += 1) {
    const item = session.next();
    seen.push(item.question);
    session.record(index === 2 ? false : true);
  }
  const retry = session.next();
  assert.equal(seen.length, 5);
  assert.equal(retry.question, seen[2]);
});

test('shared question session starts a new cycle after every question is correct', () => {
  const session = createPracticeQuestionSession(items, { random: () => 0.5 });
  for (let index = 0; index < items.length; index += 1) {
    assert.ok(session.next());
    session.record(true);
  }
  assert.equal(session.snapshot().cycleComplete, true);
  assert.ok(session.next());
  assert.equal(session.snapshot().cycle, 2);
});

test('shared question session keeps a wrong question pending until it is correct', () => {
  const session = createPracticeQuestionSession(items, { random: () => 0.5 });
  const wrong = session.next();
  session.record(false);
  for (let index = 0; index < items.length - 1; index += 1) {
    const item = session.next();
    assert.ok(item);
    session.record(true);
  }
  const retry = session.next();
  assert.equal(retry.question, wrong.question);
});
