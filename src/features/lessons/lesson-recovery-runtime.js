// Pure runtime orchestration for V4.78 lesson recovery actions.
// UI, auth, state, persistence, navigation and rendering are injected.

function requireFunction(value, message) {
  if (typeof value !== 'function') throw new Error(message);
}

export async function moveCurrentLessonToTrash({
  authorize, currentLesson, currentSubject, closeModal, moveToTrash,
  setCurrentLesson, loadLessons, setCurrentSubject, showSubject, showMessage
} = {}) {
  requireFunction(authorize, 'A lesson recovery authorization function is required.');
  requireFunction(closeModal, 'A lesson delete modal closer is required.');
  requireFunction(moveToTrash, 'A lesson trash writer is required.');
  requireFunction(loadLessons, 'A lesson loader is required.');
  requireFunction(setCurrentLesson, 'A current lesson setter is required.');
  requireFunction(setCurrentSubject, 'A current subject setter is required.');
  requireFunction(showSubject, 'A subject renderer is required.');
  const authorized = await authorize();
  if (!authorized || !currentLesson) { closeModal(); return Object.freeze({ ok: false, stage: 'authorization' }); }
  const lessonId = currentLesson.id, subject = currentSubject;
  closeModal();
  try { await moveToTrash({ lessonId }); } catch (error) {
    if (typeof showMessage === 'function') showMessage('Verwijderen mislukt: ' + String(error?.message || error), 'error');
    return Object.freeze({ ok: false, stage: 'persistence', error });
  }
  setCurrentLesson(null); await loadLessons(); setCurrentSubject(subject); await showSubject(subject);
  if (typeof showMessage === 'function') showMessage('Les naar de prullenbak verplaatst.', 'success');
  return Object.freeze({ ok: true, stage: 'complete', lessonId, subject });
}

export async function archiveCurrentLesson({
  authorize, currentLesson, currentSubject, closeModal, archiveLesson,
  setCurrentLesson, loadLessons, setCurrentSubject, showParentDashboard, showMessage
} = {}) {
  requireFunction(authorize, 'A lesson recovery authorization function is required.');
  requireFunction(closeModal, 'A lesson archive modal closer is required.');
  requireFunction(archiveLesson, 'A lesson archive writer is required.');
  requireFunction(loadLessons, 'A lesson loader is required.');
  requireFunction(setCurrentLesson, 'A current lesson setter is required.');
  requireFunction(setCurrentSubject, 'A current subject setter is required.');
  requireFunction(showParentDashboard, 'A parent dashboard renderer is required.');
  const authorized = await authorize();
  if (!authorized || !currentLesson) { closeModal(); return Object.freeze({ ok: false, stage: 'authorization' }); }
  const lessonId = currentLesson.id, subject = currentSubject;
  closeModal();
  try { await archiveLesson({ lessonId }); } catch (error) {
    if (typeof showMessage === 'function') showMessage('Archiveren mislukt: ' + String(error?.message || error), 'error');
    return Object.freeze({ ok: false, stage: 'persistence', error });
  }
  setCurrentLesson(null); await loadLessons(); setCurrentSubject(subject); await showParentDashboard();
  if (typeof showMessage === 'function') showMessage('Les gearchiveerd.', 'success');
  return Object.freeze({ ok: true, stage: 'complete', lessonId, subject });
}

export async function restoreArchivedLesson({
  authorize, lessonId, restoreLesson, loadLessons, setCurrentStudent,
  parentSelectedStudent, renderParentDashboard, showMessage
} = {}) {
  requireFunction(authorize, 'A lesson recovery authorization function is required.');
  requireFunction(restoreLesson, 'A lesson restore writer is required.');
  requireFunction(loadLessons, 'A lesson loader is required.');
  requireFunction(setCurrentStudent, 'A current student setter is required.');
  requireFunction(renderParentDashboard, 'A parent dashboard renderer is required.');
  if (!(await authorize())) return Object.freeze({ ok: false, stage: 'authorization' });
  const normalizedId = Number(lessonId);
  try { await restoreLesson({ lessonId: normalizedId }); } catch (error) {
    if (typeof showMessage === 'function') showMessage('Herstellen mislukt: ' + String(error?.message || error), 'error');
    return Object.freeze({ ok: false, stage: 'persistence', error });
  }
  await loadLessons(); setCurrentStudent(parentSelectedStudent); await renderParentDashboard();
  if (typeof showMessage === 'function') showMessage('Les teruggezet.', 'success');
  return Object.freeze({ ok: true, stage: 'complete', lessonId: normalizedId, student: parentSelectedStudent });
}

export async function restoreDeletedLesson({ authorize, lessonId, restoreLesson, loadLessons, showMessage } = {}) {
  requireFunction(authorize, 'A lesson recovery authorization function is required.');
  requireFunction(restoreLesson, 'A lesson restore writer is required.');
  requireFunction(loadLessons, 'A lesson loader is required.');
  if (!(await authorize())) return Object.freeze({ ok: false, stage: 'authorization' });
  const normalizedId = Number(lessonId);
  try { await restoreLesson({ lessonId: normalizedId }); } catch (error) {
    if (typeof showMessage === 'function') showMessage('Herstellen uit de prullenbak mislukt: ' + String(error?.message || error), 'error');
    return Object.freeze({ ok: false, stage: 'persistence', error });
  }
  await loadLessons();
  if (typeof showMessage === 'function') showMessage('Les uit de prullenbak hersteld.', 'success');
  return Object.freeze({ ok: true, stage: 'complete', lessonId: normalizedId });
}
