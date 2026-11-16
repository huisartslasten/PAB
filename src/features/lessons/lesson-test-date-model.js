// Pure reconstruction of the V4.78 lesson-editor test-date state contract.
// The legacy runtime stores test dates in localStorage; this module keeps only
// deterministic entry creation/replacement/removal decisions. No DOM or storage.

function normalizeId(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : value ?? null;
}

export function buildTestDateEntry({
  existing = null,
  lessonId,
  student,
  date,
  lesson = {}
} = {}) {
  if (!date) return null;

  return {
    id: existing?.id ?? Date.now().toString(),
    student,
    lessonId: normalizeId(lessonId),
    subject: lesson.subject,
    title: lesson.title,
    date
  };
}

export function upsertTestDateEntry(items = [], entry = null) {
  const list = Array.isArray(items) ? items.slice() : [];
  if (!entry?.date) return list;

  const index = list.findIndex(item =>
    Number(item?.lessonId) === Number(entry.lessonId) && item?.student === entry.student
  );

  if (index >= 0) list[index] = entry;
  else list.push(entry);

  return list;
}

export function removeTestDateEntry(items = [], lessonId, student) {
  return (Array.isArray(items) ? items : []).filter(item =>
    !(Number(item?.lessonId) === Number(lessonId) && item?.student === student)
  );
}
