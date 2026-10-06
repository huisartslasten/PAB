// Pure model boundary for the V4.78 editCurrentLesson() lesson-item hydration contract.
// The legacy function reads lesson_items and passes normalized values to DOM row builders.
// This module preserves those decisions without DOM, persistence, navigation, or UI work.

function text(value) {
  return String(value ?? '');
}

function partsFromStoredOrLegacy(item = {}, type) {
  const questionParts = Array.isArray(item.question_parts) && item.question_parts.length
    ? item.question_parts.slice()
    : [item.question || ''];

  const answerParts = Array.isArray(item.answer_parts) && item.answer_parts.length
    ? item.answer_parts.map(part => ({
        text: text(part?.text),
        role: part?.role || 'answer'
      }))
    : String(item.answer || '')
        .split(type === 'spelling' ? ' || ' : '\n')
        .filter(Boolean)
        .map(value => ({ text: value, role: 'answer' }));

  return { questionParts, answerParts };
}

function wordItemModel(item = {}) {
  const { questionParts, answerParts } = partsFromStoredOrLegacy(item, 'words');

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

const TYPE_CONFIG = Object.freeze({
  questions: Object.freeze({
    editor: 'questionEditor',
    answers: 'question-answer-parts',
    answerClass: 'question-a-part',
    qLabel: 'Vraag',
    answerPlaceholder: 'Schrijf hier het antwoord of de uitleg.'
  }),
  dictation: Object.freeze({
    editor: 'dictationEditor',
    answers: 'dictation-answer-parts',
    answerClass: 'dictation-a-part',
    qLabel: 'Vraag',
    answerPlaceholder: 'Vul hier het antwoord in'
  }),
  math: Object.freeze({
    editor: 'mathEditor',
    answers: 'math-answer-parts',
    answerClass: 'math-a-part',
    qLabel: 'Som',
    answerPlaceholder: 'Bijvoorbeeld 42'
  }),
  spelling: Object.freeze({
    editor: 'spellingEditor',
    answers: 'spelling-answer-parts',
    answerClass: 'spelling-a-part',
    qLabel: null,
    answerPlaceholder: 'Vul hier het antwoord in'
  })
});

export function buildLessonEditItemModels(type, lessonItems = [], { spellingQuestionLabel = 'Werkwoord' } = {}) {
  const items = Array.isArray(lessonItems) ? lessonItems : [];

  if (type === 'words' || type === 'custom') {
    return items.map(wordItemModel);
  }

  const config = TYPE_CONFIG[type];
  if (!config) return [];

  return items.map(item => {
    const parts = partsFromStoredOrLegacy(item, type);
    return {
      ...parts,
      config: {
        ...config,
        qLabel: type === 'spelling' ? spellingQuestionLabel : config.qLabel
      }
    };
  });
}
