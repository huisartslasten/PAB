export function createLessonEditorAi({ aiContent } = {}) {
  if (!aiContent || typeof aiContent.generateMultipleChoiceDistractors !== 'function') {
    throw new TypeError('Lesson editor AI requires the shared AI content service.');
  }

  return Object.freeze({
    generateMultipleChoiceDistractors(request) {
      return aiContent.generateMultipleChoiceDistractors(request);
    }
  });
}
