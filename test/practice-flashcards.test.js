import test from 'node:test';
import assert from 'node:assert/strict';
import { getPracticeMode, getPracticeModes, getActivePracticeModes } from '../src/features/practice/practice-domain.js';
import { createFlashcardSession, getCurrentFlashcard, nextFlashcard, revealFlashcard } from '../src/features/practice/flashcards/flashcard-domain.js';

test('practice structure exposes Flashcards as the first active mode and Games as planned', () => {
  assert.deepEqual(getPracticeModes(), [
    { id: 'flashcards', label: 'Flashcards', status: 'active' },
    { id: 'games', label: 'Spelletjes', status: 'planned' }
  ]);
  assert.deepEqual(getActivePracticeModes(), [
    { id: 'flashcards', label: 'Flashcards', status: 'active' }
  ]);
  assert.deepEqual(getPracticeMode('games'), {
    id: 'games',
    label: 'Spelletjes',
    status: 'planned'
  });
});

test('flashcard session starts with the question hidden answer', () => {
  const session = createFlashcardSession([
    { question: '7 × 8', answer: '56' },
    { question: 'Capital of France?', answer: 'Paris' }
  ]);

  assert.deepEqual(getCurrentFlashcard(session), {
    prompt: '7 × 8',
    answer: '56',
    revealed: false,
    index: 0,
    total: 2
  });
});

test('flashcard reveal then next resets the revealed state', () => {
  const session = createFlashcardSession([
    { question: '7 × 8', answer: '56' },
    { question: '6 × 9', answer: '54' }
  ]);

  const revealed = revealFlashcard(session);
  assert.equal(getCurrentFlashcard(revealed).revealed, true);

  const next = nextFlashcard(revealed);
  assert.deepEqual(getCurrentFlashcard(next), {
    prompt: '6 × 9',
    answer: '54',
    revealed: false,
    index: 1,
    total: 2
  });
});

test('reverse mode shows the answer first', () => {
  const session = createFlashcardSession(
    [{ question: 'Wat is 56?', answer: '7 × 8' }],
    { reverse: true }
  );

  assert.deepEqual(getCurrentFlashcard(session), {
    prompt: '7 × 8',
    answer: 'Wat is 56?',
    revealed: false,
    index: 0,
    total: 1
  });
});

test('flashcards reject empty question or answer', () => {
  assert.throws(
    () => createFlashcardSession([{ question: '', answer: '56' }]),
    /requires a question and an answer/
  );
});
