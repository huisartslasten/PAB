import { getDictationPrompt, normalizeLessonContent } from '../../lessons/lesson-content-model.js';

const text = value => String(value ?? '').trim();

function buildLanguagePair(item) {
  const content = normalizeLessonContent(item?.content_data);
  const audioText = content ? getDictationPrompt(content) : text(item?.answer);
  const answerText = text(item?.answer) || audioText;
  if (!audioText || !answerText) return null;

  return {
    question: {
      type: 'audio',
      value: '',
      audioText
    },
    answer: {
      type: 'text',
      value: answerText
    }
  };
}

function buildTextPair(item) {
  const question = text(item?.question);
  const answer = text(item?.answer);
  if (!question || !answer) return null;
  return {
    question: { type: 'text', value: question },
    answer: { type: 'text', value: answer }
  };
}

export function buildMemoryItems({ items = [], contentKind = '' } = {}) {
  const normalizedKind = text(contentKind).toLowerCase();
  const useLanguageAudio = normalizedKind === 'words' || normalizedKind === 'sentences';
  return (Array.isArray(items) ? items : [])
    .map(item => useLanguageAudio ? buildLanguagePair(item) : buildTextPair(item))
    .filter(Boolean);
}
