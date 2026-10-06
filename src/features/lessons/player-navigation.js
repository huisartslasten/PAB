// Pure navigation contract for the lesson-player flow.
// Source behavior: TEST V4.78 result-flow checkpoint 221-230.
// This module names destinations only; it does not call UI/router functions.

export const PLAYER_DESTINATIONS = Object.freeze({
  LESSON_CHOICE: 'lesson-choice',
  LESSON_BACK: 'lesson-back'
});

export function getPlayerResultDestination(action) {
  if (action === 'retry') return PLAYER_DESTINATIONS.LESSON_CHOICE;
  if (action === 'back-to-lesson') return PLAYER_DESTINATIONS.LESSON_BACK;
  return null;
}

export function getQuestionCompletionDestination() {
  return PLAYER_DESTINATIONS.LESSON_BACK;
}
