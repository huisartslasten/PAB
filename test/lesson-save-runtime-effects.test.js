import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLessonSaveRuntimeEffects, LESSON_SAVE_VALIDATION_MESSAGE } from '../src/features/lessons/lesson-save-runtime-effects.js';

test('validation failure preserves the V4.78 message and resolves the DOM dependency only when executed', async () => {
  const errorElement = { textContent: '', classList: { removed: [], remove(value) { this.removed.push(value); } } };
  let lookupCount = 0;
  const effects = buildLessonSaveRuntimeEffects({ getErrorElement: () => { lookupCount += 1; return errorElement; } });

  assert.equal(lookupCount, 0);
  const result = await effects.handleValidationFailure();

  assert.equal(lookupCount, 1);
  assert.equal(result.stage, 'validation');
  assert.equal(errorElement.textContent, LESSON_SAVE_VALIDATION_MESSAGE);
  assert.deepEqual(errorElement.classList.removed, ['hidden']);
});

test('persistence failure preserves the V4.78 error prefix', async () => {
  const errorElement = { textContent: '', classList: { remove() {} } };
  const effects = buildLessonSaveRuntimeEffects({ getErrorElement: () => errorElement });
  const error = new Error('database unavailable');
  const result = await effects.handlePersistenceFailure(error);

  assert.equal(result.stage, 'persistence');
  assert.equal(result.error, error);
  assert.equal(errorElement.textContent, 'Opslaan mislukt: database unavailable');
});

test('completion uses the runtime outcome and refreshes state and UI effects in order', async () => {
  const order = [];
  const state = { currentSubject: 'old', currentLesson: { id: 1 } };
  const effects = buildLessonSaveRuntimeEffects({
    state,
    refreshTestCalendar: async () => order.push('calendar'),
    refreshSidebars: async () => order.push('sidebars'),
    showMessage: async (message, kind) => order.push(`message:${message}:${kind}`)
  });

  const result = await effects.handleComplete({
    currentSubject: 'Nederlands',
    successMessage: 'Les opgeslagen.'
  });

  assert.equal(result.stage, 'complete');
  assert.equal(state.currentSubject, 'Nederlands');
  assert.equal(state.currentLesson, null);
  assert.deepEqual(order, ['calendar', 'sidebars', 'message:Les opgeslagen.:success']);
});

test('completion rejects a missing outcome at the execution boundary', async () => {
  const effects = buildLessonSaveRuntimeEffects();
  await assert.rejects(
    effects.handleComplete(),
    /A completed lesson save outcome is required\./
  );
});
