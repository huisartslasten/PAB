// Pure orchestration boundary for the V4.78 saveLesson() completion flow.
// Database persistence, test-date storage, lesson reload, and UI refresh are injected.
// No DOM access, navigation, or rendering implementation belongs here.

export function createLessonSaveFlow({
  persistence,
  loadLessons,
  findSavedLesson,
  upsertTestDate,
  removeTestDate,
  renderTestCalendar,
  refreshPageSidebars,
  showMessage
} = {}) {
  if (!persistence?.save) throw new Error('Lesson save persistence is required.');
  if (typeof loadLessons !== 'function') throw new Error('loadLessons is required.');
  if (typeof findSavedLesson !== 'function') throw new Error('findSavedLesson is required.');

  async function save({ lessonId = null, student = '', lesson = {}, items = [], testDate = '' } = {}) {
    const saved = await persistence.save({ lessonId, lesson, items });

    await loadLessons();

    const savedLesson = findSavedLesson(saved.lessonId, student);
    if (savedLesson) {
      if (testDate) {
        upsertTestDate?.(saved.lessonId, student, testDate, savedLesson);
      } else {
        removeTestDate?.(saved.lessonId, student);
      }
    }

    renderTestCalendar?.();
    refreshPageSidebars?.();
    showMessage?.(
      testDate ? 'Les opgeslagen en toetsdatum toegevoegd.' : 'Les opgeslagen.',
      'success'
    );

    return Object.freeze({ ...saved, savedLesson });
  }

  return Object.freeze({ save });
}
