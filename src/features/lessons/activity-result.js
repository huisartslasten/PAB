export function createActivityResult({
  prompt = '',
  answer = '',
  expected = '',
  correct = null,
  hint = '',
  explanation = ''
} = {}) {
  return Object.freeze({
    prompt: String(prompt || '').trim(),
    answer: String(answer || ''),
    expected: String(expected || ''),
    correct: correct === true ? true : correct === false ? false : null,
    hint: String(hint || '').trim(),
    explanation: String(explanation || '').trim()
  });
}
