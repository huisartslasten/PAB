// Pure model boundary for the V4.78 addWordRow() contract.
// The legacy function owns DOM creation; this module keeps only its deterministic
// input/default rules so the future DOM adapter can be tested independently.
// No DOM, persistence, AI, navigation, or UI rendering belongs here.

function text(value) {
  return String(value ?? '');
}

function normalizeQuestionParts(parts) {
  return (Array.isArray(parts) ? parts : []).map(text);
}

function normalizeAnswerParts(parts) {
  return (Array.isArray(parts) ? parts : []).map(part => ({
    text: text(part?.text),
    role: part?.role || 'answer'
  }));
}

function normalizeRules(rules) {
  if (!rules) return null;

  return {
    hint: text(rules.hint),
    min_words: Number.isFinite(Number(rules.min_words)) ? Number(rules.min_words) : 0,
    required_terms: Array.isArray(rules.required_terms)
      ? rules.required_terms.slice()
      : text(rules.required_terms)
  };
}

/**
 * Reconstruct the non-DOM state decisions made by V4.78 addWordRow().
 *
 * When parts are omitted, V4.78 mirrors the number of part controls from the
 * previous row, but clears their text. Answer-part roles are preserved.
 */
export function buildWordRowModel({
  q = '',
  a = '',
  questionParts = null,
  answerParts = null,
  previousQuestionPartCount = 0,
  previousAnswerParts = []
} = {}, rules = null) {
  const questions = questionParts
    ? normalizeQuestionParts(questionParts)
    : (previousQuestionPartCount > 0
      ? Array.from({ length: previousQuestionPartCount }, () => '')
      : ['']);

  const answers = answerParts
    ? normalizeAnswerParts(answerParts)
    : (Array.isArray(previousAnswerParts) && previousAnswerParts.length
      ? previousAnswerParts.map(part => ({ text: '', role: part?.role || 'answer' }))
      : [{ text: '', role: 'answer' }]);

  if (!questionParts && previousQuestionPartCount === 0 && q !== '') {
    questions[0] = text(q);
  }

  if (!answerParts && (!previousAnswerParts || !previousAnswerParts.length) && a !== '') {
    answers[0].text = text(a);
  }

  return Object.freeze({
    questionParts: questions,
    answerParts: answers,
    rules: normalizeRules(rules)
  });
}
