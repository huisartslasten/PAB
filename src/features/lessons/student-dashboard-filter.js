// Exact V4.78 lesson-visibility boundaries reconstructed from
// backup-test-v478-before-professional-rewrite/index.html.
//
// V4.78 does NOT use one universal lesson filter everywhere. These helpers
// preserve the verified per-context rules. Runtime wiring remains deferred
// until parity is complete.

function list(lessons) {
  return Array.isArray(lessons) ? lessons : [];
}

export function filterLessonsForStudentDashboard(lessons = [], currentStudent = null) {
  return list(lessons).filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived && !lesson?.deleted
  );
}

export function filterLessonsForSubjectPage(lessons = [], currentStudent = null, subjectKey = null, normalizeSubjectKey = value => String(value ?? '').trim().toLowerCase()) {
  return list(lessons).filter(lesson =>
    normalizeSubjectKey(lesson?.subject) === subjectKey &&
    lesson?.student === currentStudent &&
    !lesson?.archived &&
    !lesson?.deleted
  );
}

export function filterLessonsForPreparationStats(lessons = [], currentStudent = null) {
  return list(lessons).filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived
  );
}

export function filterLessonsForSidebar(lessons = [], currentStudent = null) {
  return list(lessons).filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived && !lesson?.deleted
  );
}

export function filterLessonsForAgendaLessonMatch(lessons = [], currentStudent = null) {
  return list(lessons).filter(lesson =>
    lesson?.student === currentStudent && !lesson?.archived && lesson?.lesson_items?.length
  );
}

export function filterActiveLessonsForParent(lessons = [], student = null) {
  return list(lessons).filter(lesson =>
    lesson?.student === student && !lesson?.archived && !lesson?.deleted
  );
}

export function filterArchivedLessonsForParent(lessons = [], student = null) {
  return list(lessons).filter(lesson =>
    lesson?.student === student && !!lesson?.archived && !lesson?.deleted
  );
}

export function filterArchivedLessonsForRecovery(lessons = []) {
  return list(lessons).filter(lesson => !!lesson?.archived && !lesson?.deleted);
}

export function filterDeletedLessonsForRecovery(lessons = []) {
  return list(lessons).filter(lesson => !!lesson?.deleted);
}
