import { normalizeKey } from '../../utils/text.js';

/**
 * Visibility rules extracted from the V4.78 runtime.
 *
 * V4.78 loads all lessons from Supabase and then selects lessons for the
 * active student by comparing lesson.student with currentStudent.
 * Archived/deleted handling is intentionally explicit so later screens can
 * choose their own recovery/archive view without silently changing the main view.
 */
export function lessonBelongsToStudent(lesson, student) {
  if (!lesson || !student) return false;
  return normalizeKey(lesson.student) === normalizeKey(student);
}

export function getStudentLessons(lessons = [], student) {
  if (!Array.isArray(lessons) || !student) return [];
  return lessons.filter(lesson => lessonBelongsToStudent(lesson, student));
}

export function getActiveStudentLessons(lessons = [], student) {
  return getStudentLessons(lessons, student).filter(lesson => !lesson.archived && !lesson.deleted);
}

export function getArchivedStudentLessons(lessons = [], student) {
  return getStudentLessons(lessons, student).filter(lesson => Boolean(lesson.archived) && !lesson.deleted);
}

export function getDeletedStudentLessons(lessons = [], student) {
  return getStudentLessons(lessons, student).filter(lesson => Boolean(lesson.deleted));
}
