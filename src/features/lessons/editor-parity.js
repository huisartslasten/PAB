export const lessonEditorParity = Object.freeze({
  createTitle: 'Nieuwe les',
  editTitle: 'Les bewerken',
  defaultType: 'words',
  defaultWordRows: 2,
  supportedTypes: ['words', 'questions', 'dictation', 'math', 'spelling', 'custom'],
  requiredFields: ['student', 'subject', 'title', 'items'],
  lessonFields: [
    'student',
    'subject',
    'subvak',
    'title',
    'type',
    'explanation',
    'ai_check_answers',
    'ai_instruction',
    'editor_labels'
  ],
  wordAndCustomShape: 'question_parts + answer_parts + hint + min_words + required_terms',
  questionShape: 'question_parts + answer_parts',
  dictationShape: 'question_parts + answer_parts',
  mathShape: 'question_parts + numeric answer_parts',
  spellingShape: 'question_parts + answer_parts; answer joined with ||',
  existingLessonSave: 'update lesson, replace all lesson_items',
  newLessonSave: 'insert lesson, then insert lesson_items',
  testDateHandledOutsideLessonPayload: true,
  aiBehaviorInEditor: 'not implemented by this refactor boundary'
});
