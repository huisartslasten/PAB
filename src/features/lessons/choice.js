import { getLessonComponents, getLessonComponentType } from './components.js';

const CHOICE_LABELS = Object.freeze({
  practice: 'Oefenen',
  test: 'Toets',
  questions: 'Vragen maken',
  view: 'Bekijken'
});

export function getLessonChoiceType(lessonOrType = {}) {
  const lesson = typeof lessonOrType === 'string' ? { type: lessonOrType } : lessonOrType;
  const components = getLessonComponents(lesson);
  return components.includes('practice') ? getLessonComponentType(lesson) : 'questions';
}

export function getLessonChoices(lessonOrType = {}) {
  const lesson = typeof lessonOrType === 'string' ? { type: lessonOrType } : lessonOrType;
  return getLessonComponents(lesson).filter(component => Object.hasOwn(CHOICE_LABELS, component));
}

export function getLessonChoiceCards(lesson = {}) {
  return getLessonChoices(lesson).map(id => ({ id, label: CHOICE_LABELS[id] }));
}

export function getLessonChoiceTarget(lesson = {}, choice) {
  const valid = getLessonChoices(lesson).includes(choice);
  if (!valid) return null;
  return { lessonId: lesson.id ?? null, mode: choice };
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
