import { normalizeKey } from '../../utils/text.js';
import { normalizeMultipleChoiceConfig, validateMultipleChoiceOptions } from './multiple-choice-config.js';
import { buildDictationContent, getDictationPrompt } from './lesson-content-model.js';

const text = value => String(value ?? '').trim();
const RESPONSE_TYPES = new Set(['text', 'number', 'fraction', 'multiple_choice']);

function normalizeParts(parts, fallback = '') {
  if (!Array.isArray(parts)) {
    const value = text(fallback);
    return value ? [{ text: value, role: 'answer' }] : [];
  }
  return parts
    .map(part => ({ text: text(typeof part === 'string' ? part : part?.text), role: part?.role === 'extra' ? 'extra' : 'answer' }))
    .filter(part => part.text);
}

function normalizeResponseType(value, fallback = 'text') {
  const candidate = text(value);
  return RESPONSE_TYPES.has(candidate) ? candidate : fallback;
}

function normalizeOptions(options) {
  return (Array.isArray(options) ? options : []).map(text).filter(Boolean);
}

function buildUniversalItem(row = {}, { defaultResponseType = 'text', numericAnswer = false, spelling = false, includeWordRules = false } = {}) {
  const questionParts = Array.isArray(row.question_parts)
    ? row.question_parts.map(text).filter(Boolean)
    : (text(row.question) ? [text(row.question)] : []);
  const answerParts = normalizeParts(row.answer_parts, row.answer);
  const required = answerParts.filter(part => part.role === 'answer').map(part => part.text);
  const responseType = normalizeResponseType(row.response_type ?? row.responseType, defaultResponseType);
  const answerOptions = normalizeOptions(row.answer_options ?? row.answerOptions);

  if (!questionParts.length) return null;

  let answer = spelling ? required.join(' || ') : required.join('\n');
  if (responseType === 'multiple_choice') {
    const correctOption = text(row.correct_option ?? row.correctOption ?? answer);
    const optionValidation = validateMultipleChoiceOptions({ options: answerOptions, correctOption });
    if (!optionValidation.valid) return null;
    answer = optionValidation.correctOption;
  } else if (!required.length) {
    return null;
  }

  if (numericAnswer && responseType === 'number' && !required.every(value => Number.isFinite(Number(value)))) return null;

  const item = {
    question: questionParts.join('\n'),
    answer,
    question_parts: questionParts,
    answer_parts: answerParts,
    response_type: responseType,
    answer_options: responseType === 'multiple_choice' ? answerOptions : [],
    difficulty: row.difficulty ?? null
  };

  if (responseType === 'multiple_choice') {
    const configured = normalizeMultipleChoiceConfig(row.multiple_choice_config ?? row.multipleChoiceConfig ?? {
      enabled: true,
      optionCount: answerOptions.length
    });
    item.multiple_choice_config = {
      enabled: true,
      optionCount: configured.optionCount
    };
  }

  if (includeWordRules) {
    if (row.hint != null) item.hint = text(row.hint);
    if (row.min_words != null) item.min_words = Math.max(0, Number(row.min_words) || 0);
    if (row.required_terms != null) {
      item.required_terms = Array.isArray(row.required_terms)
        ? row.required_terms.map(text).filter(Boolean)
        : text(row.required_terms).split(',').map(text).filter(Boolean);
    }
  }

  return item;
}

export function buildWordItem(row = {}) { return buildUniversalItem(row, { includeWordRules: true }); }
export function buildQuestionItem(row = {}) { return buildUniversalItem(row, { defaultResponseType: 'text' }); }

export function buildDictationItem(row = {}) {
  const questionParts = Array.isArray(row.question_parts) ? row.question_parts.map(text).filter(Boolean) : (text(row.question) ? [text(row.question)] : []);
  const contentKind = text(row.content_kind ?? row.contentKind) || 'words';
  const parts = normalizeParts(row.answer_parts, row.answer ?? row.word);
  const answerPart = parts.find(part => part.role === 'answer');
  const doelwoord = text(row.doelwoord ?? row.targetWord ?? row.word ?? answerPart?.text ?? row.answer);
  const zin = text(row.zin ?? row.sentence);
  const content = buildDictationContent({ contentKind, doelwoord, zin });
  if (!content) return null;

  const prompt = getDictationPrompt(content);
  const answer = prompt;
  const responseType = normalizeResponseType(row.response_type ?? row.responseType, 'text');
  const answerOptions = normalizeOptions(row.answer_options ?? row.answerOptions);

  if (responseType === 'multiple_choice') {
    const correctOption = text(row.correct_option ?? row.correctOption ?? answer);
    const optionValidation = validateMultipleChoiceOptions({ options: answerOptions, correctOption });
    if (!optionValidation.valid) return null;
    return {
      question: questionParts.join('\n'),
      answer: optionValidation.correctOption,
      question_parts: questionParts,
      answer_parts: parts.length ? parts : [{ text: answer, role: 'answer' }],
      response_type: 'multiple_choice',
      answer_options: optionValidation.options,
      content_data: content,
      multiple_choice_config: {
        enabled: true,
        optionCount: normalizeMultipleChoiceConfig(row.multiple_choice_config ?? row.multipleChoiceConfig ?? { enabled: true, optionCount: optionValidation.options.length }).optionCount
      }
    };
  }

  return {
    question: questionParts.join('\n'),
    answer,
    question_parts: questionParts,
    answer_parts: parts.length ? parts : [{ text: answer, role: 'answer' }],
    response_type: 'text',
    answer_options: [],
    content_data: content,
    difficulty: row.difficulty ?? null
  };
}

export function buildMathItem(row = {}) { return buildUniversalItem(row, { defaultResponseType: 'number', numericAnswer: true }); }
export function buildSpellingItem(row = {}) { return buildUniversalItem(row, { spelling: true }); }

export function isMeaningfulItem(item = {}, type = 'words') {
  if (type === 'dictation') return Boolean(normalizeKey(item.answer || '') && item.content_data);
  if (item.response_type === 'multiple_choice') return Boolean(normalizeKey(item.question || '') && normalizeKey(item.answer || '') && Array.isArray(item.answer_options) && item.answer_options.length >= 2);
  return Boolean(normalizeKey(item.question || '') && normalizeKey(item.answer || ''));
}

const ELEMENT_BUILDERS = Object.freeze({
  words: buildWordItem,
  custom: buildWordItem,
  questions: buildQuestionItem,
  dictation: buildDictationItem,
  math: buildMathItem,
  spelling: buildSpellingItem
});

export function getLessonElementDefinition(type) {
  const normalizedType = text(type);
  const build = ELEMENT_BUILDERS[normalizedType];
  return build ? Object.freeze({ type: normalizedType, build }) : null;
}

export function listLessonElementDefinitions() {
  return Object.freeze(Object.entries(ELEMENT_BUILDERS).map(([type, build]) => Object.freeze({ type, build })));
}

export function buildItemsForType(type, rows = []) {
  const definition = getLessonElementDefinition(type);
  if (!definition) return [];
  return (Array.isArray(rows) ? rows : []).map((row, index) => {
    const item = definition.build(row);
    return item ? { ...item, sort_order: index } : null;
  }).filter(Boolean).filter(item => isMeaningfulItem(item, type));
}
