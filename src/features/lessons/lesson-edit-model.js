// Pure model boundary for the V4.78 editCurrentLesson() lesson-item hydration contract.
// The legacy function reads lesson_items and passes normalized values to DOM row builders.
// This module preserves those decisions without DOM, persistence, navigation, or UI work.

function text(value) {
  return String(value ?? '');
}

function wordItemModel(item = {}) {
  const questionParts = Array.isArray(item.question_parts) && item.question_parts.length
    ? item.question_parts.slice()
    : [item.question || ''];

  const answerParts = Array.isArray(item.answer_parts) && item.answer_parts.length
    ? item.answer_parts.map(part => ({
        text: text(part?.text),
        role: part?.role || 'answer'
      }))
    : [{ text: item.answer || '', role: 'answer' }];

  return {
    questionParts,
    answerParts,
    rules: {
      hint: item.hint || '',
      min_words: item.min_words || 0,
      required_terms: Array.isArray(item.required_terms) ? item.required_terms : []
    }
  };
}

export function buildLessonEditItemModels(type, lessonItems = []) {
  const items = Array.isArray(lessonItems) ? lessonItems : [];

  if (type === 'words' || type === 'custom') {
    return items.map(wordItemModel);
  }

  return items.map(item => ({
    questionParts: Array.isArray(item.question_parts) && item.question_parts.length
      ? item.question_parts.slice()
      : [item.question || ''],
    answerParts: Array.isArray(item.answer_parts) && item.answer_parts.length
      ? item.answer_parts.map(part => ({
          text: text(part?.text),
          role: part?.role || 'answer'
        }))
      : String(item.answer || '')
          .split(type === 'spelling' ? ' || ' : '\n')
          .filter(Boolean)
          .map(value => ({ text: value, role: 'answer' }))
  }));
}
