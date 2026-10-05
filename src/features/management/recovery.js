import { getArchivedStudentLessons, getDeletedStudentLessons } from '../lessons/visibility.js';

export function getArchiveEntries(lessons = [], student) {
  return getArchivedStudentLessons(lessons, student);
}

export function getTrashEntries(lessons = [], student) {
  return getDeletedStudentLessons(lessons, student);
}

export function canRestoreLesson(lesson) {
  return Boolean(lesson?.archived || lesson?.deleted);
}
