import { getStudentLessons, getActiveStudentLessons, getArchivedStudentLessons, getDeletedStudentLessons } from './visibility.js';

export function createStudentLessonScope(lessons = [], student) {
  return Object.freeze({
    all: getStudentLessons(lessons, student),
    active: getActiveStudentLessons(lessons, student),
    archived: getArchivedStudentLessons(lessons, student),
    deleted: getDeletedStudentLessons(lessons, student)
  });
}
