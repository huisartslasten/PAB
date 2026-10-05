import { normalizeKey } from '../../utils/text.js';

export function buildWordItem(question = '', answer = '') {
  return { question: String(question ?? '').trim(), answer: String(answer ?? '').trim() };
}

export function buildQuestionItem(question = '', answer = '') {
  return { question: String(question ?? '').trim(), answer: String(answer ?? '').trim() };
}

export function buildDictationItem(word = '') {
  const value = String(word ?? '').trim();
  return { question: value, answer: value };
}

export function isMeaningfulItem(item = {}) {
  return Boolean(normalizeKey(item.question || '') || normalizeKey(item.answer || ''));
}

export function buildItemsForType(type, rows = []) {
  const builders = {
    words: row => buildWordItem(row.question, row.answer),
    questions: row => buildQuestionItem(row.question, row.answer),
    dictation: row => buildDictationItem(row.question ?? row.word ?? row.answer)
  };
  const build = builders[type] || builders.words;
  return (Array.isArray(rows) ? rows : []).map(build).filter(isMeaningfulItem).map((item, index) => ({ ...item, sort_order: index }));
}
