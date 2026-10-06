// Pure V4.78 test-calendar side-effect model for saveLesson().
// LocalStorage/UI writes stay outside this boundary.

export function upsertLessonTestDate({
  items = [],
  lessonId,
  student,
  date,
  lesson,
  createId = () => Date.now().toString()
} = {}) {
  if (!date) return Array.isArray(items) ? items.slice() : [];

  const source = Array.isArray(items) ? items : [];
  const index = source.findIndex(item =>
    Number(item?.lessonId) === Number(lessonId) && item?.student === student
  );

  const entry = {
    id: index >= 0 ? source[index].id : createId(),
    student,
    lessonId: Number(lessonId),
    subject: lesson?.subject,
    title: lesson?.title,
    date
  };

  const next = source.slice();
  if (index >= 0) next[index] = entry;
  else next.push(entry);
  return next;
}

export function removeLessonTestDate({ items = [], lessonId, student } = {}) {
  const source = Array.isArray(items) ? items : [];
  return source.filter(item => !(
    Number(item?.lessonId) === Number(lessonId) && item?.student === student
  ));
}

export function syncLessonTestDate({
  items = [],
  lessonId,
  student,
  date,
  lesson,
  createId
} = {}) {
  if (date) {
    return upsertLessonTestDate({ items, lessonId, student, date, lesson, createId });
  }
  return removeLessonTestDate({ items, lessonId, student });
}
