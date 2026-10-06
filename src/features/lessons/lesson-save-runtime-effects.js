// Pure runtime-effects adapter for the V4.78 lesson save flow.
// It translates the proven save outcome into injected application side effects.
// Persistence/reload/calendar-sync remain owned by the save coordinator.
// No DOM, global state, rendering, navigation, or localStorage is accessed directly.

export const LESSON_SAVE_VALIDATION_MESSAGE = 'Vul het vak, de lestitel en minstens één item in.';

export function buildLessonSaveRuntimeEffects({
  getErrorElement,
  state = {},
  refreshTestCalendar,
  refreshSidebars,
  showMessage
} = {}) {
  const resolveErrorElement = () => (
    typeof getErrorElement === 'function' ? getErrorElement() : null
  );

  async function handleValidationFailure() {
    const errorElement = resolveErrorElement();
    if (errorElement) {
      errorElement.textContent = LESSON_SAVE_VALIDATION_MESSAGE;
      errorElement.classList?.remove?.('hidden');
    }
    return Object.freeze({ ok: false, stage: 'validation' });
  }

  async function handlePersistenceFailure(error) {
    const errorElement = resolveErrorElement();
    if (errorElement) {
      errorElement.textContent = 'Opslaan mislukt: ' + String(error?.message || error || 'Onbekende fout.');
      errorElement.classList?.remove?.('hidden');
    }
    return Object.freeze({ ok: false, stage: 'persistence', error });
  }

  async function handleComplete(nextOutcome) {
    if (!nextOutcome || typeof nextOutcome !== 'object') {
      throw new Error('A completed lesson save outcome is required.');
    }

    state.currentSubject = nextOutcome.currentSubject;
    state.currentLesson = null;

    if (typeof refreshTestCalendar === 'function') await refreshTestCalendar();
    if (typeof refreshSidebars === 'function') await refreshSidebars();
    if (typeof showMessage === 'function') await showMessage(nextOutcome.successMessage, 'success');

    return Object.freeze({ ok: true, stage: 'complete' });
  }

  return Object.freeze({ handleValidationFailure, handlePersistenceFailure, handleComplete });
}
