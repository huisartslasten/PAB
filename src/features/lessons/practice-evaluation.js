import { evaluateAnswer } from './answer-evaluation.js';

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function gcd(a, b) {
  let x = Math.abs(Number(a));
  let y = Math.abs(Number(b));
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

export function parseFraction(value) {
  const raw = String(value ?? '').trim().replace(',', '.');
  if (!raw) return null;

  const mixed = raw.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  const simple = raw.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  const whole = raw.match(/^-?\d+(?:\.0+)?$/);

  if (mixed) {
    const wholePart = Number(mixed[1]);
    const numerator = Number(mixed[2]);
    const denominator = Number(mixed[3]);
    if (!denominator || numerator < 0 || numerator >= Math.abs(denominator)) return null;
    const sign = wholePart < 0 ? -1 : 1;
    const denominatorAbs = Math.abs(denominator);
    const numeratorAbs = Math.abs(wholePart) * denominatorAbs + numerator;
    const divisor = gcd(numeratorAbs, denominatorAbs);
    return { numerator: sign * numeratorAbs / divisor, denominator: denominatorAbs / divisor };
  }

  if (simple) {
    const numerator = Number(simple[1]);
    const denominator = Number(simple[2]);
    if (!denominator || !Number.isInteger(numerator) || !Number.isInteger(denominator)) return null;
    const sign = denominator < 0 ? -1 : 1;
    const normalizedNumerator = numerator * sign;
    const normalizedDenominator = Math.abs(denominator);
    const divisor = gcd(normalizedNumerator, normalizedDenominator);
    return { numerator: normalizedNumerator / divisor, denominator: normalizedDenominator / divisor };
  }

  if (whole) {
    const number = Number(raw);
    if (!Number.isFinite(number)) return null;
    return { numerator: number, denominator: 1 };
  }

  return null;
}

export function fractionsEqual(left, right) {
  const a = parseFraction(left);
  const b = parseFraction(right);
  return Boolean(a && b && a.numerator === b.numerator && a.denominator === b.denominator);
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
  if (item?.response_type === 'multiple_choice') {
    return normalize(userAnswer) === normalize(item?.answer);
  }

  if (item?.response_type === 'fraction') {
    return fractionsEqual(userAnswer, item?.answer);
  }

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
