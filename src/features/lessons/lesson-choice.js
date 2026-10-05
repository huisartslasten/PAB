import { normalizeKey } from '../../utils/text.js';

export function getLessonType(lesson = {}) {
  return normalizeKey(lesson.type || '');
}

export function getLessonChoices(lesson = {}) {
  const type = getLessonType(lesson);
  const choices = [{ id: 'practice', label: 'Oefenen' }];
  if (['woordtrainer', 'woorden trainer', 'dictee'].includes(type)) {
    choices.push({ id: 'test', label: 'Toets' });
  }
  return choices;
}

export function getLessonChoiceTarget(lesson = {}, choice) {
  const valid = getLessonChoices(lesson).some(item => item.id === choice);
  if (!valid) return null;
  return { lessonId: lesson.id ?? null, mode: choice };
}
