import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLessonSaveRuntimeEffects, LESSON_SAVE_VALIDATION_MESSAGE } from '../src/features/lessons/lesson-save-runtime-effects.js';

test('validation failure preserves the V4.78 message and does not run completion effects', async () => {
  const errorElement = { textContent: '', classList: { removed: [], remove(value) { this.removed.push(value); } } };
  const effects = buildLessonSaveRuntimeEffects({ outcome: {} , errorElement });
  const result = await effects.handleValidationFailure();

  assert.equal(result.stage, 'validation');
  assert.equal(errorElement.textContent, LESSON_SAVE_VALIDATION_MESSAGE);
  assert.deepEqual(errorElement.classList.removed, ['hidden']);
});

test('persistence failure preserves the V4.78 error prefix', async () => {
  const errorElement = { textContent: '', classList: { remove() {} } };
  const effects = buildLessonSaveRuntimeEffects({ outcome: {}, errorElement });
  const error = new Error('database unavailable');
  const result = await effects.handlePersistenceFailure(error);

  assert.equal(result.stage, 'persistence');
  assert.equal(result.error, error);
  assert.equal(errorElement.textContent, 'Opslaan mislukt: database unavailable');
});

test('completion applies state then refreshes calendar, sidebars, and success message in order', async () => {
  const order = [];
  const state = { currentSubject: 'old', currentLesson: { id: 1 } };
  const effects = buildLessonSaveRuntimeEffects({
    outcome: {
      currentSubject: 'Nederlands',
      successMessage: 'Les opgeslagen.'
    },
    state,
    refreshTestCalendar: async () => order.push('calendar'),
    refreshSidebars: async () => order.push('sidebars'),
    showMessage: async (message, kind) => order.push(`message:${message}:${kind}`)
  });

  const result = await effects.handleComplete();

  assert.equal(result.stage, 'complete');
  assert.equal(state.currentSubject, 'Nederlands');
  assert.equal(state.currentLesson, null);
  assert.deepEqual(order, ['calendar', 'sidebars', 'message:Les opgeslagen.:success']);
});

test('rejects a missing outcome', () => {
  assert.throws(
    () => buildLessonSaveRuntimeEffects(),
    /A lesson save outcome is required\./
  );
});
