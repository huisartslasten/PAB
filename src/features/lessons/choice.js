import { isPracticeModeActive } from '../practice/practice-domain.js';

const LESSON_TYPES = Object.freeze([
  'words',
  'custom',
  'dictation',
  'spelling',
  'math',
  'questions'
]);

const CHOICE_LABELS = Object.freeze({
  practice: 'Oefenen',
  test: 'Toets',
  questions: 'Vragen maken',
  view: 'Bekijken'
});

function normalizeLessonType(lessonOrType = {}) {
  return typeof lessonOrType === 'string'
    ? lessonOrType.trim().toLowerCase()
    : String(lessonOrType?.type || '').trim().toLowerCase();
}

export function getLessonChoiceType(lessonOrType = {}) {
  const type = normalizeLessonType(lessonOrType);
  return type === 'questions' || !LESSON_TYPES.includes(type) ? 'questions' : 'practice';
}

export function getLessonChoices(lessonOrType = {}) {
  const type = normalizeLessonType(lessonOrType);

  if (getLessonChoiceType(type) === 'questions') {
    return ['questions', 'view'];
  }

  const choices = [];
  if (isPracticeModeActive('flashcards')) choices.push('practice');
  choices.push('test', 'view');
  return choices;
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
