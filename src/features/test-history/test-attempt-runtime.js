import { saveTestAttemptPersistence } from './test-attempt-write-service.js';

export async function saveTestAttemptRuntime({ db, currentStudent, currentLesson, attempt } = {}) {
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
