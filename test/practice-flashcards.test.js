import test from 'node:test';
import assert from 'node:assert/strict';
import { getPracticeModesForLesson, getPracticeSelectionCopy } from '../src/features/lessons/learning-experience-registry.js';
import { createFlashcardSession, getCurrentFlashcard, nextFlashcard, revealFlashcard } from '../src/features/practice/flashcards/flashcard-domain.js';

test('practice structure exposes the canonical active practice modes', () => {
  assert.deepEqual(getPracticeModesForLesson({ lessonType: 'dictation', contentKind: 'words' }), [
    { id: 'dictation', label: 'Dictee', description: 'Luister en schrijf wat je hoort.' },
    { id: 'flashcards', label: 'Flashcards', description: 'Oefen vraag en antwoord met kaarten.' },
    { id: 'memory', label: 'Memory', description: 'Koppel de juiste vraag aan het antwoord.' },
    { id: 'practice-test', label: 'Oefentoets', description: 'Maak een oefentoets met deze lesstof.' },
    { id: 'games', label: 'Spelletjes', description: 'Oefen de les spelenderwijs.' }
  ]);

  assert.deepEqual(getPracticeModesForLesson({ lessonType: 'words', contentKind: 'words' }), [
    { id: 'flashcards', label: 'Flashcards', description: 'Oefen vraag en antwoord met kaarten.' },
    { id: 'practice-test', label: 'Oefentoets', description: 'Maak een oefentoets met deze lesstof.' },
    { id: 'games', label: 'Spelletjes', description: 'Oefen de les spelenderwijs.' }
  ]);
});

test('practice selection copy is owned by the experience registry', () => {
  assert.deepEqual(getPracticeSelectionCopy({ contentKind: 'words', hasMultipleContentKinds: false }), {
    subtitle: 'Kies de oefenvorm.',
    heading: 'HOE wil je woorden oefenen?',
    description: 'Kies de oefenvorm.'
  });

  assert.deepEqual(getPracticeSelectionCopy({ hasMultipleContentKinds: true }), {
    subtitle: 'Kies eerst WAT je wilt oefenen en daarna HOE.',
    heading: 'WAT wil je oefenen?',
    description: 'Kies eerst welk onderdeel van deze les je wilt oefenen.'
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
    hint: '',
    hintRevealed: false,
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
    hint: '',
    hintRevealed: false,
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
    hint: '',
    hintRevealed: false,
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
