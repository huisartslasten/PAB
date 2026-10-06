// Pure orchestration boundary for the V4.78 saveLesson() completion flow.
// Contract source: TEST V4.78 backup index.html (blob de4ebcc75b1b333cc985936c86f7c654c818be24).
// Database persistence, test-date storage, lesson reload, and UI refresh are injected.
// No DOM access, navigation, or rendering implementation belongs here.

export function createLessonSaveFlow({
  persistence,
  loadLessons,
  findSavedLesson,
  setCurrentSubject,
  clearCurrentLesson,
  upsertTestDate,
  removeTestDate,
  renderTestCalendar,
  refreshPageSidebars,
  showMessage
} = {}) {
  if (!persistence?.save) throw new Error('Lesson save persistence is required.');
  if (typeof loadLessons !== 'function') throw new Error('loadLessons is required.');
  if (typeof findSavedLesson !== 'function') throw new Error('findSavedLesson is required.');

  async function save({ lessonId = null, student = '', subject = '', lesson = {}, items = [], testDate = '' } = {}) {
    const saved = await persistence.save({ lessonId, lesson, items });

    // Exact V4.78 state transition immediately after successful persistence:
    // currentSubject = subject; currentLesson = null; await loadLessons().
    setCurrentSubject?.(subject);
    clearCurrentLesson?.();

    await loadLessons();

    // V4.78 finds the freshly reloaded lesson by id only.
    const savedLesson = findSavedLesson(saved.lessonId);
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
