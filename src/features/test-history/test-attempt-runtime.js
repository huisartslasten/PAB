import { saveTestAttemptPersistence } from './test-attempt-write-service.js';

function requireFunction(value, message) {
  if (typeof value !== 'function') throw new Error(message);
}

export async function saveTestAttemptRuntime({ authorize, db, currentStudent, currentLesson, attempt } = {}) {
  requireFunction(authorize, 'A test-attempt authorization function is required.');
  if (!(await authorize())) return Object.freeze({ ok: false, stage: 'authorization' });

  const result = await saveTestAttemptPersistence({
    db,
    lessonId: currentLesson?.id,
    student: currentStudent,
    attempt,
    currentLessonType: currentLesson?.type
  });

  return Object.freeze({
    ok: true,
    stage: 'complete',
    ...(result || {})
  });
}
