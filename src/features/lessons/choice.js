import { getLessonComponents, getLessonComponentType } from './components.js';

export function getLessonChoiceType(lessonOrType = {}) {
  const lesson = typeof lessonOrType === 'string' ? { type: lessonOrType } : lessonOrType;
  const components = getLessonComponents(lesson);
  return components.includes('practice') ? getLessonComponentType(lesson) : 'questions';
}

export function getLessonChoices(lessonOrType = {}) {
  const lesson = typeof lessonOrType === 'string' ? { type: lessonOrType } : lessonOrType;
  return getLessonComponents(lesson).filter(component =>
    ['practice', 'test', 'questions', 'view'].includes(component)
  );
}

export function getLessonChoiceMeta(lesson) {
  if (!lesson) return null;
  const items = Array.isArray(lesson.lesson_items)
    ? lesson.lesson_items
    : Array.isArray(lesson.items)
      ? lesson.items
      : [];

  return {
    title: String(lesson.title || ''),
    subject: String(lesson.subject || ''),
    type: String(lesson.type || ''),
    itemCount: items.length
  };
}
