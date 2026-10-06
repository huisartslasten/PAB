// Pure runtime orchestration for V4.78 lesson recovery actions.
// UI, auth, state, persistence, navigation and rendering are injected.

export async function moveCurrentLessonToTrash({
  authorize,
  currentLesson,
  currentSubject,
  closeModal,
  moveToTrash,
  setCurrentLesson,
  loadLessons,
  setCurrentSubject,
  showSubject,
  showMessage
} = {}) {
  if (typeof authorize !== 'function') throw new Error('A lesson recovery authorization function is required.');
  if (typeof closeModal !== 'function') throw new Error('A lesson delete modal closer is required.');
  if (typeof moveToTrash !== 'function') throw new Error('A lesson trash writer is required.');
  if (typeof loadLessons !== 'function') throw new Error('A lesson loader is required.');
  if (typeof setCurrentLesson !== 'function') throw new Error('A current lesson setter is required.');
  if (typeof setCurrentSubject !== 'function') throw new Error('A current subject setter is required.');
  if (typeof showSubject !== 'function') throw new Error('A subject renderer is required.');

  const authorized = await authorize();
  if (!authorized || !currentLesson) {
    closeModal();
    return Object.freeze({ ok: false, stage: 'authorization' });
  }

  const lessonId = currentLesson.id;
  const subject = currentSubject;
  closeModal();

  try {
    await moveToTrash({ lessonId });
  } catch (error) {
    if (typeof showMessage === 'function') {
      showMessage('Verwijderen mislukt: ' + String(error?.message || error), 'error');
    }
    return Object.freeze({ ok: false, stage: 'persistence', error });
  }

  setCurrentLesson(null);
  await loadLessons();
  setCurrentSubject(subject);
  await showSubject(subject);
  if (typeof showMessage === 'function') {
    showMessage('Les naar de prullenbak verplaatst.', 'success');
  }

  return Object.freeze({ ok: true, stage: 'complete', lessonId, subject });
}
