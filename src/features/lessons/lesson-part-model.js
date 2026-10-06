// Pure model boundary for the V4.78 universal lesson-part builders.
// The legacy helpers create DOM nodes; this module preserves their input/default
// decisions without DOM, persistence, navigation, or UI rendering.

function text(value) {
  return String(value ?? '');
}

export function buildQuestionPartModel(value = '') {
  return Object.freeze({
    text: text(value),
    placeholder: 'Vul hier de vraag in'
  });
}

export function buildAnswerPartModel({
  text: value = '',
  role = 'answer',
  placeholder = 'Vul hier het antwoord in'
} = {}) {
  const normalizedRole = role === 'extra' ? 'extra' : 'answer';

  return Object.freeze({
    text: text(value),
    role: normalizedRole,
    placeholder: text(placeholder),
    roleLabel: normalizedRole === 'extra' ? 'Wordt niet getoetst' : 'Wordt getoetst'
  });
}
