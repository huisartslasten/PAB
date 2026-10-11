import { normalizeKey } from '../../utils/text.js';

const LESSON_COMPONENTS = Object.freeze({
  words: Object.freeze(['practice', 'flashcards', 'test', 'view']),
  custom: Object.freeze(['practice', 'flashcards', 'test', 'view']),
  dictation: Object.freeze(['practice', 'flashcards', 'test', 'view']),
  spelling: Object.freeze(['practice', 'flashcards', 'test', 'view']),
  math: Object.freeze(['practice', 'flashcards', 'test', 'view']),
  questions: Object.freeze(['questions', 'view'])
});

export function getLessonComponentType(lesson = {}) {
  return normalizeKey(lesson.type || '');
}

export function getLessonComponents(lesson = {}) {
  const type = getLessonComponentType(lesson);
  return [...(LESSON_COMPONENTS[type] || LESSON_COMPONENTS.questions)];
}

export function hasLessonComponent(lesson = {}, component) {
  return getLessonComponents(lesson).includes(component);
}
