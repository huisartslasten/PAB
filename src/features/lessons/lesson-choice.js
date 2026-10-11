import { getLessonComponents, getLessonComponentType } from './components.js';

export function getLessonType(lesson = {}) {
  return getLessonComponentType(lesson);
}

export function getLessonChoices(lesson = {}) {
  return getLessonComponents(lesson)
    .filter(component => ['practice', 'test', 'questions', 'view'].includes(component))
    .map(id => ({
      id,
      label: {
        practice: 'Oefenen',
        test: 'Toets',
        questions: 'Vragen maken',
        view: 'Bekijken'
      }[id]
    }));
}

export function getLessonChoiceTarget(lesson = {}, choice) {
  const valid = getLessonChoices(lesson).some(item => item.id === choice);
  if (!valid) return null;
  return { lessonId: lesson.id ?? null, mode: choice };
}