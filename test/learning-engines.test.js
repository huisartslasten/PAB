import test from 'node:test';
import assert from 'node:assert/strict';
import { createPracticeSession } from '../src/features/lessons/practice-engine.js';
import { createTestSession } from '../src/features/lessons/test-engine.js';
import { createQuestionSession } from '../src/features/lessons/question-engine.js';

test('practice session repeats until every item is mastered', () => {
  const session = createPracticeSession([{ id: 1, answer: 'Kat' }, { id: 2, answer: 'Hond' }]);
  assert.equal(session.total, 2);
  assert.equal(session.nextItem(() => 0).id, 1);
  assert.equal(session.submit('kat').correct, true);
  assert.equal(session.mastered, 1);
  assert.equal(session.nextItem(() => 0).id, 2);
  assert.equal(session.submit('fout').correct, false);
  assert.equal(session.remaining, 1);
});

test('test session records answers and calculates a percentage', async () => {
  const session = createTestSession([
    { id: 1, question: 'Dier', answer: 'Kat' },
    { id: 2, question: 'Dier', answer: 'Hond' }
  ], {
    type: 'words',
    gradeAnswer: async (_question, expected, given) => ({ correct: expected.toLowerCase() === given.toLowerCase() })
  });

  assert.equal((await session.submit('kat')).done, false);
  assert.equal((await session.submit('paard')).done, true);
  assert.deepEqual(session.result(), { correct: 1, total: 2, score: 50, answers: session.answers });
});

test('question session shows the entered answer together with the expected answer', () => {
  const session = createQuestionSession([{ id: 1, question: 'Vraag', answer: 'Voorbeeld' }]);
  assert.deepEqual(session.reveal('Mijn antwoord'), {
    item: { id: 1, question: 'Vraag', answer: 'Voorbeeld' },
    answer: 'Mijn antwoord',
    expected: 'Voorbeeld'
  });
  assert.equal(session.next(true).done, true);
  assert.deepEqual(session.results[0].selfAssessment, true);
});
