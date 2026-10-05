export function lessonActivityBackTarget({ currentSubject = null, currentLesson = null } = {}) {
  if (currentSubject) return { view: 'subject', subject: currentSubject };
  if (currentLesson) return { view: 'lesson-choice', lessonId: currentLesson.id ?? null };
  return { view: 'home' };
}

export function lessonChoiceTarget(lessonId) {
  return { view: 'lesson-choice', lessonId: lessonId ?? null };
}
