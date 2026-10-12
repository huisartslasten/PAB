import { evaluateAnswer } from './answer-evaluation.js';

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function countAnswerWords(value) {
  return String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
}

export function evaluateFixedAnswerRules(item, userAnswer) {
  const min = Math.max(0, Number(item?.min_words || 0));
  const required = Array.isArray(item?.required_terms)
    ? item.required_terms.map(value => String(value ?? '').trim()).filter(Boolean)
    : [];
  const normalized = normalize(userAnswer);
  const words = countAnswerWords(userAnswer);
  const results = [];
  if (min > 0) results.push({ ok: words >= min, text: `minimaal ${min} woorden (je hebt er ${words})` });
  required.forEach(term => results.push({ ok: normalized.includes(normalize(term)), text: `bevat “${term}”` }));
  return Object.freeze({
    ok: results.every(result => result.ok),
    results: Object.freeze(results.map(result => Object.freeze(result))),
    hasRules: results.length > 0
  });
}

export function getPracticeAnswerParts(item) {
  const answerParts = Array.isArray(item?.answer_parts)
    ? item.answer_parts
      .filter(part => part && part.role === 'answer' && String(part.text ?? '').trim())
      .map(part => String(part.text))
    : [];
  return answerParts.length ? answerParts : [String(item?.answer ?? '')];
}

export function evaluatePracticeDeterministicAnswer(type, item, userAnswer) {
  if (type === 'spelling') {
    const expected = String(item?.answer ?? '').split(' || ');
    const given = String(userAnswer ?? '').split(' || ');
    return Boolean(
      evaluateAnswer(given[0], expected[0], normalize).correct &&
      evaluateAnswer(given[1], expected[1], normalize).correct
    );
  }

  if (type === 'dictation') {
    return getPracticeAnswerParts(item).some(answer => normalize(userAnswer) === normalize(answer));
  }

  if (type === 'math') return Number(userAnswer) === Number(item?.answer);

  return evaluateAnswer(userAnswer, item?.answer, normalize).correct;
}
