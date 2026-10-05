export function createAnswerView({ entered = '', expected = '', correct = null, hint = '', explanation = '' } = {}) {
  return Object.freeze({
    entered: String(entered ?? ''),
    expected: String(expected ?? ''),
    correct: correct === true ? true : correct === false ? false : null,
    hint: String(hint || '').trim(),
    explanation: String(explanation || '').trim()
  });
}
