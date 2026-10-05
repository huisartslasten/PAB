import { normalizeKey } from '../../utils/text.js';

const text = value => String(value ?? '').trim();

function normalizeParts(parts = [], fallback = '') {
  if (!Array.isArray(parts)) {
    const value = text(fallback);
    return value ? [{ text: value, role: 'answer' }] : [];
  }
  return parts
    .map(part => ({ text: text(part?.text), role: part?.role === 'extra' ? 'extra' : 'answer' }))
    .filter(part => part.text);
}

function buildUniversalItem(row = {}, { numericAnswer = false, spelling = false } = {}) {
  const questionParts = Array.isArray(row.question_parts)
    ? row.question_parts.map(text).filter(Boolean)
    : (text(row.question) ? [text(row.question)] : []);
  const answerParts = normalizeParts(row.answer_parts, row.answer);
  const required = answerParts.filter(part => part.role === 'answer').map(part => part.text);

  if (!questionParts.length || !required.length) return null;
  if (numericAnswer && !required.every(value => Number.isFinite(Number(value)))) return null;

  const item = {
    question: questionParts.join('\n'),
    answer: spelling ? required.join(' || ') : required.join('\n'),
    question_parts: questionParts,
    answer_parts: answerParts
  };

  if (row.hint != null) item.hint = text(row.hint);
  if (row.min_words != null) item.min_words = Math.max(0, Number(row.min_words) || 0);
  if (row.required_terms != null) {
    item.required_terms = Array.isArray(row.required_terms)
      ? row.required_terms.map(text).filter(Boolean)
      : text(row.required_terms).split(',').map(text).filter(Boolean);
  }

  return item;
}

export function buildWordItem(row = {}) {
  return buildUniversalItem(row);
}

export function buildQuestionItem(row = {}) {
  return buildUniversalItem(row);
}

export function buildDictationItem(row = {}) {
  return buildUniversalItem(row);
}

export function buildMathItem(row = {}) {
  return buildUniversalItem(row, { numericAnswer: true });
}

export function buildSpellingItem(row = {}) {
  return buildUniversalItem(row, { spelling: true });
}

export function isMeaningfulItem(item = {}) {
  return Boolean(normalizeKey(item.question || '') && normalizeKey(item.answer || ''));
}

export function buildItemsForType(type, rows = []) {
  const builders = {
    words: buildWordItem,
    custom: buildWordItem,
    questions: buildQuestionItem,
    dictation: buildDictationItem,
    math: buildMathItem,
    spelling: buildSpellingItem
  };
  const build = builders[type] || builders.words;

  return (Array.isArray(rows) ? rows : [])
    .map(build)
    .filter(isMeaningfulItem)
    .map((item, index) => ({ ...item, sort_order: index }));
}
