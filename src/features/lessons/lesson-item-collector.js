// Pure reconstruction of the V4.78 collectItems() contract.
// The legacy function reads DOM rows; this module receives the already-read row values
// and performs only the deterministic filtering and item shaping that V4.78 applied.
// No DOM, persistence, AI, navigation, or UI behavior belongs here.

import { normalizeWordItemRules } from './word-item-rules.js';

function text(value) {
  return String(value ?? '').trim();
}

function normalizeQuestionParts(parts) {
  return (Array.isArray(parts) ? parts : []).map(text).filter(Boolean);
}

function normalizeAnswerParts(parts) {
  return (Array.isArray(parts) ? parts : [])
    .map(part => ({
      text: text(part?.text),
      role: text(part?.role) || 'answer'
    }))
    .filter(part => part.text);
}

function buildItem({ questionParts, answerParts, sortOrder, rules = null, answerSeparator = '\n' }) {
  const questions = normalizeQuestionParts(questionParts);
  const parts = normalizeAnswerParts(answerParts);
  const required = parts.filter(part => part.role === 'answer').map(part => part.text);

  if (!questions.length || !required.length) return null;

  const item = {
    question: questions.join('\n'),
    answer: required.join(answerSeparator),
    question_parts: questions,
    answer_parts: parts,
    sort_order: sortOrder
  };

  if (rules) {
    const normalizedRules = normalizeWordItemRules(rules);
    item.hint = normalizedRules.hint;
    item.min_words = normalizedRules.min_words;
    item.required_terms = normalizedRules.required_terms;
  }

  return item;
}

export function collectLessonItems(type, rows = []) {
  const list = Array.isArray(rows) ? rows : [];
  const items = [];

  list.forEach((row, index) => {
    let item = null;
    const questionParts = row?.questionParts;
    const answerParts = row?.answerParts;

    if (type === 'words' || type === 'custom') {
      item = buildItem({
        questionParts,
        answerParts,
        sortOrder: index,
        rules: row?.rules || null
      });
    }

    if (type === 'questions') {
      item = buildItem({ questionParts, answerParts, sortOrder: index });
    }

    if (type === 'dictation') {
      item = buildItem({ questionParts, answerParts, sortOrder: index });
    }

    if (type === 'math') {
      const parts = normalizeAnswerParts(answerParts);
      const required = parts.filter(part => part.role === 'answer').map(part => part.text);
      if (required.every(value => Number.isFinite(Number(value)))) {
        item = buildItem({ questionParts, answerParts, sortOrder: index });
      }
    }

    if (type === 'spelling') {
      item = buildItem({ questionParts, answerParts, sortOrder: index, answerSeparator: ' || ' });
    }

    if (item) items.push(item);
  });

  return items;
}