// Pure persistence boundary for V4.78 lesson recovery actions.
// Source behavior: delete -> deleted=true, archived=false; archive -> archived=true;
// restore -> archived=false, deleted=false with Number(id). UI, auth, state,
// navigation and messages remain outside this service.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') {
    throw new Error('A lesson recovery database client is required.');
  }
  return db;
}

function requireLessonId(lessonId) {
  if (lessonId === null || lessonId === undefined || lessonId === '') {
    throw new Error('A lesson id is required.');
  }
  return lessonId;
}

async function updateLesson(db, lessonId, patch) {
  const client = requireDb(db);
  const id = requireLessonId(lessonId);
  const result = await client.from('lessons').update(patch).eq('id', id);
  if (result?.error) throw result.error;
  return Object.freeze({ ok: true, lessonId: id, patch: Object.freeze({ ...patch }) });
}

export async function moveLessonToTrash({ db, lessonId } = {}) {
  return updateLesson(db, lessonId, { deleted: true, archived: false });
}

export async function archiveLesson({ db, lessonId } = {}) {
  return updateLesson(db, lessonId, { archived: true });
}

export async function restoreLesson({ db, lessonId } = {}) {
  const normalizedId = Number(requireLessonId(lessonId));
  return updateLesson(db, normalizedId, { deleted: false, archived: false });
}
