// Runtime boundary for V4.78 lesson ordering.

export async function getOrderedLessonsRuntime({
  list,
  student,
  subject,
  readOrder,
  applyOrder
} = {}) {
  if (!Array.isArray(list)) throw new Error('A lesson list is required.');
  if (typeof readOrder !== 'function') throw new Error('A lesson-order reader is required.');
  if (typeof applyOrder !== 'function') throw new Error('A lesson-order applier is required.');

  const saved = await readOrder(student, subject);
  return applyOrder(list, saved);
}

export async function saveLessonOrderRuntime({
  student,
  subject,
  list,
  writeOrder,
  persistRemote
} = {}) {
  if (typeof writeOrder !== 'function') throw new Error('A lesson-order writer is required.');
  await writeOrder(student, subject, list, { persistRemote: persistRemote !== false });
  return Object.freeze({ ok: true, ids: (Array.isArray(list) ? list : []).map(lesson => Number(lesson.id)) });
}
