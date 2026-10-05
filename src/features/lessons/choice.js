const CHOICES = Object.freeze({
  words: ['practice', 'test'],
  dictation: ['practice', 'test'],
  questions: ['practice']
});

export function getLessonChoiceType(type) {
  return CHOICES[type] ? type : 'questions';
}

export function getLessonChoices(type) {
  return [...(CHOICES[type] || CHOICES.questions)];
}

export function getLessonChoiceMeta(lesson) {
  if (!lesson) return null;
  const count = Array.isArray(lesson.lesson_items) ? lesson.lesson_items.length : 0;
  return {
    title: String(lesson.title || ''),
    subject: String(lesson.subject || ''),
    type: String(lesson.type || ''),
    itemCount: count
  };
}
