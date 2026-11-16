import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayerAttempt } from '../src/features/lessons/player-attempt.js';

test('player attempt makes lesson and student context explicit', () => {
  const session = {
    type: 'dictation',
    startedAt: '2026-10-06T00:00:00.000Z',
    answers: [
      { item: { id: 1, question: 'fiets', answer: 'fiets' }, value: 'Fiets', correct: true }
    ]
  };

  const attempt = createPlayerAttempt({
    lesson: { id: 'lesson-1', title: 'Dictee 1', type: 'dictation' },
    student: 'Zyon',
    session,
    finishedAt: '2026-10-06T00:05:00.000Z'
  });

  assert.deepEqual(attempt, {
    lessonId: 'lesson-1',
    lessonTitle: 'Dictee 1',
    type: 'dictation',
    student: 'Zyon',
    answers: session.answers,
    startedAt: '2026-10-06T00:00:00.000Z',
    finishedAt: '2026-10-06T00:05:00.000Z'
  });
});

test('player attempt prefers the session test type over the lesson type', () => {
  const attempt = createPlayerAttempt({
    lesson: { id: 1, title: 'Les', type: 'words' },
    student: 'Zyon',
    session: {
      type: 'dictation',
      startedAt: 'start',
      answers: []
    },
    finishedAt: 'finish'
  });

  assert.equal(attempt.type, 'dictation');
});

test('player attempt rejects missing lesson or session context', () => {
  assert.throws(() => createPlayerAttempt({ session: {} }), /A lesson is required/);
  assert.throws(() => createPlayerAttempt({ lesson: {} }), /A player session is required/);
});
