export const lessonEditorParity = Object.freeze({
  createTitle: 'Nieuwe les',
  editTitle: 'Les bewerken',
  defaultType: 'words',
  defaultWordRows: 2,
  supportedTypes: ['words', 'questions', 'dictation'],
  requiredFields: ['student', 'subject', 'title', 'items'],
  dictationStoresWordInQuestionAndAnswer: true,
  existingLessonSave: 'update lesson, replace all lesson_items',
  newLessonSave: 'insert lesson, then insert lesson_items',
  testDateHandledOutsideLessonPayload: true
});
