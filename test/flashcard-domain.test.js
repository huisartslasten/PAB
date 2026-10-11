import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createFlashcardSession,
  getCurrentFlashcard,
  getFlashcardCards,
  nextFlashcard,
  revealFlashcard
} from '../src/features/practice/flashcards/flashcard-domain.js';

test('flashcard data adapter keeps only complete cards', () => {
  assert.deepEqual(
    getFlashcardCards([
      { question: 'Eén', answer: 'One' },
      { question: '', answer: 'Two' },
      { question: 'Drie', answer: ' ' }
    ]),
    [{ question: 'Eén', answer: 'One' }]
  );
});

test('flashcard session preserves normal and reverse practice', () => {
  const cards = [{ question: 'Eén', answer: 'One' }, { question: 'Twee', answer: 'Two' }];
  let session = createFlashcardSession(cards);

  assert.equal(getCurrentFlashcard(session).prompt, 'Eén');
  session = revealFlashcard(session);
  assert.equal(getCurrentFlashcard(session).answer, 'One');
  session = nextFlashcard(session);
  assert.equal(getCurrentFlashcard(session).prompt, 'Twee');

  const reverse = createFlashcardSession(cards, { reverse: true });
  assert.equal(getCurrentFlashcard(reverse).prompt, 'One');
  assert.equal(getCurrentFlashcard(reverse).answer, 'Eén');
});
