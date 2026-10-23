import { createPracticeQuestionSession } from './question-session.js';

const items = [
  { question: 'A', answer: 'a' },
  { question: 'B', answer: 'b' },
  { question: 'C', answer: 'c' },
  { question: 'D', answer: 'd' },
  { question: 'E', answer: 'e' }
];

describe('createPracticeQuestionSession', () => {
  test('retries a wrong question after the remaining first-pass questions', () => {
    const session = createPracticeQuestionSession(items, { random: () => 0.5 });
    const seen = [];
    const first = session.next();
    seen.push(first.question);
    session.record(true);
    const second = session.next();
    seen.push(second.question);
    session.record(true);
    const third = session.next();
    seen.push(third.question);
    session.record(false);
    const fourth = session.next();
    seen.push(fourth.question);
    session.record(true);
    const fifth = session.next();
    seen.push(fifth.question);
    session.record(true);
    const retry = session.next();
    expect(seen).toHaveLength(5);
    expect(retry.question).toBe(third.question);
  });

  test('starts a new cycle after every question is correct', () => {
    const session = createPracticeQuestionSession(items, { random: () => 0.5 });
    for (let index = 0; index < items.length; index += 1) {
      expect(session.next()).not.toBeNull();
      session.record(true);
    }
    expect(session.snapshot().cycleComplete).toBe(true);
    const next = session.next();
    expect(next).not.toBeNull();
    expect(session.snapshot().cycle).toBe(2);
  });

  test('keeps a wrong question pending until it is answered correctly', () => {
    const session = createPracticeQuestionSession(items, { random: () => 0.5 });
    for (let index = 0; index < items.length - 1; index += 1) {
      session.next();
      session.record(index === 1 ? false : true);
    }
    let current = session.next();
    expect(current).not.toBeNull();
    session.record(false);
    current = session.next();
    expect(current).not.toBeNull();
  });
});
