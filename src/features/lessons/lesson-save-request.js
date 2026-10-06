// Pure bridge from the canonical lesson-save model to the coordinator write contract.
// No DOM, auth, persistence, UI, navigation, or application-state access.

export function buildLessonSaveExecutionRequest(model = {}) {
  if (!model || typeof model !== 'object') {
    throw new Error('A lesson save model is required.');
  }

  return Object.freeze({
    id: model.lessonId ?? null,
    lesson: model.lesson || {},
    items: Array.isArray(model.items) ? model.items.map(item => ({ ...item })) : [],
    testDate: model.testDate || ''
  });
}
