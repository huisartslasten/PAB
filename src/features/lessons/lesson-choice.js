import { normalizeKey } from '../../utils/text.js';

const TESTABLE_TYPES = new Set([
  'words',
  'custom',
  'dictation',
  'spelling',
  'math'
]);

export function getLessonType(lesson = {}) {
  return normalizeKey(lesson.type || '');
}

export function getLessonChoices(lesson = {}) {
  const type = getLessonType(lesson);
  const choices = [];

  if (TESTABLE_TYPES.has(type)) {
    choices.push(
      { id: 'practice', label: 'Oefenen' },
      { id: 'test', label: 'Toets' },
      { id: 'view', label: 'Bekijken' }
    );
    return choices;
  }

  // V4.78 question-based lessons have no practice/test flow.
  choices.push(
    { id: 'questions', label: 'Vragen maken' },
    { id: 'view', label: 'Bekijken' }
  );
  return choices;
}

export function getLessonChoiceTarget(lesson = {}, choice) {
  const valid = getLessonChoices(lesson).some(item => item.id === choice);
  if (!valid) return null;
  return { lessonId: lesson.id ?? null, mode: choice };
}
