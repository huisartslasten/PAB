// Pure runtime-effects adapter for the V4.78 lesson save flow.
// It translates the proven save outcome into injected application side effects.
// Persistence/reload/calendar-sync remain owned by the save coordinator.
// No DOM, global state, rendering, navigation, or localStorage is accessed directly.

export const LESSON_SAVE_VALIDATION_MESSAGE = 'Vul het vak, de lestitel en minstens één item in.';

export function buildLessonSaveRuntimeEffects({
  outcome,
  errorElement,
  state = {},
  refreshTestCalendar,
  refreshSidebars,
  showMessage
} = {}) {
  if (!outcome || typeof outcome !== 'object') {
    throw new Error('A lesson save outcome is required.');
  }

  async function handleValidationFailure() {
    if (errorElement) {
      errorElement.textContent = LESSON_SAVE_VALIDATION_MESSAGE;
      errorElement.classList?.remove?.('hidden');
    }
    return Object.freeze({ ok: false, stage: 'validation' });
  }

  async function handlePersistenceFailure(error) {
    if (errorElement) {
      errorElement.textContent = 'Opslaan mislukt: ' + String(error?.message || error || 'Onbekende fout.');
      errorElement.classList?.remove?.('hidden');
    }
    return Object.freeze({ ok: false, stage: 'persistence', error });
  }

  async function handleComplete() {
    state.currentSubject = outcome.currentSubject;
    state.currentLesson = null;

    if (typeof refreshTestCalendar === 'function') await refreshTestCalendar();
    if (typeof refreshSidebars === 'function') await refreshSidebars();
    if (typeof showMessage === 'function') await showMessage(outcome.successMessage, 'success');

    return Object.freeze({ ok: true, stage: 'complete' });
  }

  return Object.freeze({ handleValidationFailure, handlePersistenceFailure, handleComplete });
}
