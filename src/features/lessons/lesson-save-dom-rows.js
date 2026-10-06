// DOM-to-row adapter for the V4.78 lesson editor.
// Reads editor rows only; item filtering/shaping remains in lesson-item-collector.js.
// No persistence, auth, navigation, rendering, or global application state.

function value(input) {
  return String(input?.value || '').trim();
}

function readAnswerParts(row, selector) {
  return [...row.querySelectorAll(selector)].map(input => ({
    text: value(input),
    role: value(input.closest('.word-part-row')?.querySelector('.word-part-role')) || 'answer'
  }));
}

export function readLessonEditorRows({ documentRef, type } = {}) {
  if (!documentRef) throw new Error('A document reference is required.');
  const editorId = {
    words: 'wordEditor',
    custom: 'wordEditor',
    questions: 'questionEditor',
    dictation: 'dictationEditor',
    math: 'mathEditor',
    spelling: 'spellingEditor'
  }[type];
  if (!editorId) return [];

  return [...(documentRef.querySelectorAll?.(`#${editorId} .editor-row`) || [])].map(row => ({
    questionParts: [...row.querySelectorAll('.word-q-part')].map(value),
    answerParts: readAnswerParts(row, {
      words: '.word-a-part',
      custom: '.word-a-part',
      questions: '.question-a-part',
      dictation: '.dictation-a-part',
      math: '.math-a-part',
      spelling: '.spelling-a-part'
    }[type]),
    rules: type === 'words' || type === 'custom'
      ? {
          hint: value(row.querySelector('.word-item-hint')),
          min_words: value(row.querySelector('.word-item-min-words')),
          required_terms: value(row.querySelector('.word-item-required-terms'))
        }
      : null
  }));
}
