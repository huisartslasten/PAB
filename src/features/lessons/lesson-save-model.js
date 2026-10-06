// Pure reconstruction of the V4.78 saveLesson() lesson-level payload contract.
// DOM access, duplicate-subvak lookup, persistence, UI, and navigation stay outside.

export function buildLessonSaveModel({
  student = '',
  subject = '',
  enteredSubvak = '',
  existingSubvak = '',
  title = '',
  type = '',
  explanation = '',
  aiCheckAnswers = false,
  aiInstruction = '',
  editorLabels = null,
  items = [],
  lessonId = null,
  testDate = ''
} = {}) {
  const subvak = String(existingSubvak || '').trim() || String(enteredSubvak || '').trim();

  return Object.freeze({
    lessonId,
    lesson: {
      student,
      subject,
      subvak,
      title,
      type,
      explanation,
      ai_check_answers: aiCheckAnswers,
      ai_instruction: aiInstruction,
      editor_labels: editorLabels
    },
    items: (Array.isArray(items) ? items : []).map(item => ({
      ...item,
      hint: item.hint || '',
      min_words: Number(item.min_words || 0),
      required_terms: Array.isArray(item.required_terms) ? item.required_terms : []
    })),
    testDate: testDate || ''
  });
}
