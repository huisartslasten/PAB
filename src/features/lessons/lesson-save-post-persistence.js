// Pure model of the V4.78 post-persistence save outcome.
// Reloading, state mutation, rendering and UI remain outside this boundary.

export function resolveLessonSavePostPersistence({
  lessons = [],
  lessonId,
  subject = '',
  testDate = ''
} = {}) {
  const list = Array.isArray(lessons) ? lessons : [];
  const savedLesson = list.find(lesson => Number(lesson?.id) === Number(lessonId)) || null;

  return Object.freeze({
    currentSubject: subject,
    currentLesson: null,
    savedLesson,
    testCalendarAction: savedLesson
      ? (testDate ? 'upsert' : 'remove')
      : 'none',
    successMessage: testDate
      ? 'Les opgeslagen en toetsdatum toegevoegd.'
      : 'Les opgeslagen.'
  });
}
