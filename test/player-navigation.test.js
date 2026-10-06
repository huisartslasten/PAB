import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PLAYER_DESTINATIONS,
  getPlayerResultDestination,
  getQuestionCompletionDestination
} from '../src/features/lessons/player-navigation.js';

test('retry from the result returns to the lesson-choice destination', () => {
  assert.equal(
    getPlayerResultDestination('retry'),
    PLAYER_DESTINATIONS.LESSON_CHOICE
  );
});

test('back-to-lesson uses the normal lesson-back destination', () => {
  assert.equal(
    getPlayerResultDestination('back-to-lesson'),
    PLAYER_DESTINATIONS.LESSON_BACK
  );
});

test('unknown result actions do not invent a destination', () => {
  assert.equal(getPlayerResultDestination('unknown'), null);
});

test('question completion returns to the lesson-back destination', () => {
  assert.equal(
    getQuestionCompletionDestination(),
    PLAYER_DESTINATIONS.LESSON_BACK
  );
});
