import { normalizeContentKind } from './learning-experience-registry.js';

const text = value => String(value ?? '').trim();

export function normalizeLessonContent(value = null) {
  if (!value || typeof value !== 'object') return null;
  const kind = normalizeContentKind(value.content_kind ?? value.kind);
  if (!kind) return null;

  const doelwoord = text(value.doelwoord);
  const zin = text(value.zin);
  if (!doelwoord && !zin) return null;

  return Object.freeze({
    schema: 1,
    kind: 'language',
    content_kind: kind,
    doelwoord,
    zin
  });
}

export function buildDictationContent({ contentKind = 'words', doelwoord = '', zin = '' } = {}) {
  const content = normalizeLessonContent({
    content_kind: contentKind,
    doelwoord,
    zin
  });
  if (!content) return null;
  if (content.content_kind === 'sentences' && !content.zin) return null;
  if (!content.doelwoord && !content.zin) return null;
  return content;
}

export function getDictationPrompt(content) {
  const normalized = normalizeLessonContent(content);
  if (!normalized) return '';
  return normalized.content_kind === 'sentences'
    ? normalized.zin
    : normalized.doelwoord;
}

export function filterLessonItemsByContentKind(lesson = {}, contentKind = '') {
  const kind = normalizeContentKind(contentKind);
  const items = Array.isArray(lesson?.items)
    ? lesson.items
    : Array.isArray(lesson?.lesson_items)
      ? lesson.lesson_items
      : [];
  if (!kind) return [...items];

  const declaredKinds = items
    .map(item => normalizeContentKind(item?.content_data?.content_kind ?? item?.content_data?.kind))
    .filter(Boolean);

  if (declaredKinds.length) {
    return items.filter(item => normalizeContentKind(item?.content_data?.content_kind ?? item?.content_data?.kind) === kind);
  }

  const defaultKinds = {
    dictation: ['words', 'sentences'],
    words: ['words'],
    questions: ['questions'],
    math: ['math'],
    spelling: ['spelling'],
    custom: ['custom']
  };
  return (defaultKinds[String(lesson?.type ?? '').trim().toLowerCase()] || []).includes(kind) ? [...items] : [];
}
