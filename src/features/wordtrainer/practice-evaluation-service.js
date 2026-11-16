import { normalizeKey } from '../../utils/text.js';

export function countAnswerWords(value) {
  return String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
}

export function checkFixedAnswerRules(item, userAnswer) {
  const min = Math.max(0, Number(item?.min_words || 0));
  const required = Array.isArray(item?.required_terms)
    ? item.required_terms.map(value => String(value ?? '').trim()).filter(Boolean)
    : [];
  const normalized = normalizeKey(userAnswer);
  const words = countAnswerWords(userAnswer);
  const results = [];

  if (min > 0) {
    results.push({
      ok: words >= min,
      text: `minimaal ${min} woorden (je hebt er ${words})`
    });
  }

  required.forEach(term => {
    results.push({
      ok: normalized.includes(normalizeKey(term)),
      text: `bevat “${term}”`
    });
  });

  return {
    ok: results.every(result => result.ok),
    results,
    hasRules: results.length > 0
  };
}

function acceptedDictationAnswers(item) {
  const accepted = Array.isArray(item?.answer_parts)
    ? item.answer_parts
        .filter(part => part && part.role === 'answer' && String(part.text ?? '').trim())
        .map(part => part.text)
    : [];
  return accepted.length ? accepted : [item?.answer];
}

function evaluateSpelling(item, userAnswer) {
  const expected = String(item?.answer ?? '').split(' || ');
  const given = String(userAnswer ?? '').split(' || ');
  return normalizeKey(given[0]) === normalizeKey(expected[0])
    && normalizeKey(given[1]) === normalizeKey(expected[1]);
}

function evaluateDictation(item, userAnswer) {
  return acceptedDictationAnswers(item).some(answer => normalizeKey(userAnswer) === normalizeKey(answer));
}

function evaluateMath(item, userAnswer) {
  return Number(userAnswer) === Number(item?.answer);
}

function evaluateExact(item, userAnswer) {
  return normalizeKey(userAnswer) === normalizeKey(item?.answer);
}

/**
 * V4.78 practice-answer contract. AI grading is injected so this boundary has
 * no Supabase or network ownership of its own.
 */
export async function evaluatePracticeAnswer({ type, lessonType, item, userAnswer, aiCheckAnswers = true, gradeWithAI } = {}) {
  const mode = String(type || lessonType || 'words');

  if (mode === 'spelling') {
    return { correct: evaluateSpelling(item, userAnswer), feedback: '', fixedRules: null };
  }

  if (mode === 'dictation') {
    return { correct: evaluateDictation(item, userAnswer), feedback: '', fixedRules: null };
  }

  if (mode === 'math') {
    return { correct: evaluateMath(item, userAnswer), feedback: '', fixedRules: null };
  }

  const fixedRules = checkFixedAnswerRules(item, userAnswer);
  if (fixedRules.hasRules && !fixedRules.ok) {
    return { correct: false, feedback: '', fixedRules };
  }

  const shouldUseAi = mode !== 'custom' || aiCheckAnswers;
  if (!shouldUseAi) {
    return { correct: evaluateExact(item, userAnswer), feedback: '', fixedRules };
  }

  if (typeof gradeWithAI !== 'function') {
    throw new Error('evaluatePracticeAnswer requires gradeWithAI when AI grading is enabled');
  }

  const grading = await gradeWithAI(item?.question, item?.answer, userAnswer);
  return {
    correct: grading?.correct === true,
    feedback: String(grading?.feedback || ''),
    fixedRules
  };
}
