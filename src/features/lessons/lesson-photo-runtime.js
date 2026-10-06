function requireFunction(value, message) {
  if (typeof value !== 'function') throw new Error(message);
}

export async function createLessonFromPhotoRuntime({
  authorize,
  student,
  subject,
  title,
  type,
  pairs,
  persistLesson,
  loadLessons,
  lessons,
  setCurrentStudent,
  setCurrentSubject,
  setCurrentLesson,
  saveSourcePhoto,
  shouldSaveSourcePhoto,
  sourcePhotoFile,
  showMessage,
  showParentDashboard
} = {}) {
  requireFunction(authorize, 'A photo-lesson authorization function is required.');
  requireFunction(persistLesson, 'A photo-lesson persistence function is required.');
  requireFunction(loadLessons, 'A lesson loader is required.');
  requireFunction(setCurrentStudent, 'A current-student setter is required.');
  requireFunction(setCurrentSubject, 'A current-subject setter is required.');
  requireFunction(setCurrentLesson, 'A current-lesson setter is required.');
  requireFunction(showParentDashboard, 'A parent-dashboard navigation function is required.');

  if (!(await authorize())) return Object.freeze({ ok: false, stage: 'authorization' });

  const created = await persistLesson({ student, subject, title, type, pairs });

  await loadLessons();
  setCurrentStudent(student);
  setCurrentSubject(subject);
  const savedLesson = (Array.isArray(lessons) ? lessons : [])
    .find(lesson => Number(lesson.id) === Number(created.lesson.id)) || null;
  setCurrentLesson(savedLesson);

  if (shouldSaveSourcePhoto && sourcePhotoFile && typeof saveSourcePhoto === 'function') {
    try {
      await saveSourcePhoto(created.lesson.id, sourcePhotoFile);
    } catch (error) {
      if (typeof showMessage === 'function') {
        showMessage('Les is gemaakt, maar de bronfoto kon niet worden opgeslagen.', 'error');
      }
    }
  }

  if (typeof showMessage === 'function') {
    showMessage('Les gemaakt uit de foto. Controleer hem gerust nog even.', 'success');
  }
  await showParentDashboard();

  return Object.freeze({
    ok: true,
    stage: 'complete',
    lessonId: created.lesson.id,
    student,
    subject,
    title,
    type
  });
}
