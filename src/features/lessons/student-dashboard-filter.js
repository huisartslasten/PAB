// Exact V4.78 lesson-visibility boundaries reconstructed from
// backup-test-v478-before-professional-rewrite/index.html.
//
// These helpers are intentionally kept separate because V4.78 does NOT use
// one universal lesson filter everywhere. Different UI areas have different
// visibility rules. Runtime wiring remains deferred until the complete matrix
// has been verified.

export function filterLessonsForStudentDashboard(lessons = [], currentStudent = null) {
  if (!Array.isArray(lessons)) return [];
  return lessons.filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived && !lesson?.deleted
  );
}

export function filterLessonsForPreparationStats(lessons = [], currentStudent = null) {
  if (!Array.isArray(lessons)) return [];
  return lessons.filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived
  );
}

export function filterLessonsForSidebar(lessons = [], currentStudent = null) {
  if (!Array.isArray(lessons)) return [];
  return lessons.filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived && !lesson?.deleted
  );
}

export function filterLessonsForAgendaLessonMatch(lessons = [], currentStudent = null) {
  if (!Array.isArray(lessons)) return [];
  return lessons.filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived && lesson?.lesson_items?.length
  );
}
