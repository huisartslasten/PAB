const normalize = value => String(value ?? '').trim().toLowerCase();

export function countAnswerWords(value) {
  return String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
}

export function checkFixedAnswerRules(item, userAnswer) {
  const min = Math.max(0, Number(item?.min_words || 0));
  const required = Array.isArray(item?.required_terms)
    ? item.required_terms.map(value => String(value ?? '').trim()).filter(Boolean)
    : [];
  const normalized = normalize(userAnswer);
  const words = countAnswerWords(userAnswer);
  const results = [];

  if (min > 0) results.push({ ok: words >= min, text: `minimaal ${min} woorden (je hebt er ${words})` });
  required.forEach(term => results.push({ ok: normalized.includes(normalize(term)), text: `bevat “${term}”` }));

  return { ok: results.every(result => result.ok), results, hasRules: results.length > 0 };
}

export function evaluateExactAnswer(item, userAnswer) {
  // V4.78 dictation/test evaluation compares the normalized input directly
  // with item.answer. Do not broaden this to answer_parts here.
  return normalize(userAnswer) === normalize(item?.answer);
}

export function evaluateMathAnswer(item, userAnswer) {
  return Number(userAnswer) === Number(item?.answer);
}

export function evaluateSpellingAnswer(item, firstAnswer, secondAnswer) {
  const expected = String(item?.answer ?? '').split(' || ');
  return normalize(firstAnswer) === normalize(expected[0]) && normalize(secondAnswer) === normalize(expected[1]);
}

export function evaluatePracticeAnswer({ type, item, userAnswer, firstAnswer, secondAnswer } = {}) {
  if (type === 'spelling') return evaluateSpellingAnswer(item, firstAnswer, secondAnswer);
  if (type === 'math') return evaluateMathAnswer(item, userAnswer);
  if (type === 'dictation') return evaluateExactAnswer(item, userAnswer);

  const fixed = checkFixedAnswerRules(item, userAnswer);
  if (fixed.hasRules && !fixed.ok) return false;
  return null;
}
