import test from 'node:test';
import assert from 'node:assert/strict';
import { createPracticeSession, createQuestionSession, createTestSession } from '../src/features/lessons/player-session.js';
import {
  checkFixedAnswerRules,
  evaluateExactAnswer,
  evaluateMathAnswer,
  evaluateSpellingAnswer
} from '../src/features/lessons/player-evaluation.js';

const identityShuffle = items => [...items];

test('practice starts with all items remaining and removes only correct answers', () => {
  const session = createPracticeSession([{ id: 1 }, { id: 2 }], { shuffle: identityShuffle });

  assert.equal(session.kind, 'practice');
  assert.equal(session.remainingCount, 2);
  assert.equal(session.masteredCount, 0);
  assert.deepEqual(session.next(), { id: 1 });

  session.submit(false);
  assert.equal(session.remainingCount, 2);

  session.next();
  session.submit(true);
  assert.equal(session.remainingCount, 1);
  assert.equal(session.masteredCount, 1);
});

test('practice finishes only after every remaining item has been answered correctly', () => {
  const session = createPracticeSession([{ id: 1 }], { shuffle: identityShuffle });
  session.next();
  session.submit(true);

  assert.equal(session.finished, false);
  assert.equal(session.next(), null);
  assert.equal(session.finished, true);
});

test('test session keeps ordered answers and advances one item at a time', () => {
  const session = createTestSession([{ id: 1 }, { id: 2 }], {
    shuffle: identityShuffle,
    startedAt: '2026-10-05T00:00:00.000Z'
  });

  assert.equal(session.index, 0);
  assert.deepEqual(session.current, { id: 1 });
  assert.equal(session.startedAt, '2026-10-05T00:00:00.000Z');
  assert.deepEqual(session.submit({ itemId: 1, value: 'antwoord', correct: true }), { id: 2 });
  assert.equal(session.index, 1);
  assert.deepEqual(session.answers, [{ itemId: 1, value: 'antwoord', correct: true }]);
  assert.equal(session.submit({ itemId: 2, value: 'fout', correct: false }), null);
  assert.equal(session.finished, true);
});

test('question session reveals the learner answer before moving to the next question', () => {
  const session = createQuestionSession([{ id: 1, question: 'Vraag 1' }, { id: 2, question: 'Vraag 2' }], { shuffle: identityShuffle });

  assert.equal(session.revealed, false);
  assert.deepEqual(session.reveal('Mijn antwoord'), {
    question: { id: 1, question: 'Vraag 1' },
    answer: 'Mijn antwoord',
    revealed: true
  });
  assert.equal(session.revealed, true);
  assert.deepEqual(session.next(), { id: 2, question: 'Vraag 2' });
  assert.equal(session.revealed, false);
  assert.equal(session.answer, '');
});

test('V4.78 fixed answer rules require minimum words and required terms', () => {
  const item = { min_words: 3, required_terms: ['computer', 'kennis'] };
  assert.equal(checkFixedAnswerRules(item, 'Veel computer kennis'), false);
  assert.equal(checkFixedAnswerRules(item, 'Veel computer kennis vandaag').ok, true);
});

test('V4.78 exact dictation answers accept persisted answer parts', () => {
  const item = {
    answer: 'fiets',
    answer_parts: [
      { text: 'fiets', role: 'answer' },
      { text: 'rijwiel', role: 'extra' }
    ]
  };
  assert.equal(evaluateExactAnswer(item, 'Fiets'), true);
  assert.equal(evaluateExactAnswer(item, 'rijwiel'), false);
});

test('V4.78 math answers are numeric comparisons', () => {
  assert.equal(evaluateMathAnswer({ answer: '4' }, '4'), true);
  assert.equal(evaluateMathAnswer({ answer: '4' }, 'vier'), false);
});

test('V4.78 spelling compares both persisted forms', () => {
  const item = { answer: 'werkte || gewerkt' };
  assert.equal(evaluateSpellingAnswer(item, 'werkte', 'gewerkt'), true);
  assert.equal(evaluateSpellingAnswer(item, 'werkte', 'werkend'), false);
});
