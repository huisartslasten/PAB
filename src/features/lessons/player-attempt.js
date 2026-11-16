// Explicit attempt/context contract for the lesson-player finish flow.
// This replaces the V4.78 reliance on currentLesson/currentStudent globals
// without changing the underlying result or persistence contracts.

const text = value => String(value ?? '');

export function createPlayerAttempt({
  lesson = null,
  student = null,
  session = null,
  finishedAt = new Date().toISOString()
} = {}) {
  if (!lesson || typeof lesson !== 'object') {
    throw new Error('A lesson is required.');
  }
  if (!session || typeof session !== 'object') {
    throw new Error('A player session is required.');
  }

  const answers = Array.isArray(session.answers) ? session.answers : [];

  return Object.freeze({
    lessonId: lesson.id ?? null,
    lessonTitle: text(lesson.title),
    type: text(session.type || lesson.type || 'words'),
    student: student == null ? null : text(student),
    answers: answers.map(answer => Object.freeze({ ...answer })),
    startedAt: session.startedAt ?? null,
    finishedAt
  });
}
