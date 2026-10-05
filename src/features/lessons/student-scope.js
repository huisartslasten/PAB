export function filterLessonsForStudent(lessons = [], student = '') {
  const wanted = String(student || '').trim();
  return (Array.isArray(lessons) ? lessons : []).filter(
    lesson => String(lesson?.student || '').trim() === wanted
  );
}

export function hasActiveStudentLesson(lesson, student = '') {
  if (!lesson) return false;
  if (String(lesson.student || '').trim() !== String(student || '').trim()) return false;
  return !Boolean(lesson.archived_at || lesson.deleted_at || lesson.trashed);
}
