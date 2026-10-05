// Exact V4.78 student-dashboard lesson visibility boundary.
// Reconstructed from backup-test-v478-before-professional-rewrite/index.html.
//
// V4.78 renderSubjects() used:
//   lessons.filter(l => l.student === currentStudent && !l.archived)
//
// This module intentionally mirrors that rule and does not add a deleted check
// that was not present in the verified V4.78 expression. Runtime wiring remains
// deferred until the complete per-page visibility matrix has been verified.

export function filterLessonsForStudentDashboard(lessons = [], currentStudent = null) {
  if (!Array.isArray(lessons)) return [];
  return lessons.filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived
  );
}
