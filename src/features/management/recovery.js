import { getArchivedStudentLessons, getDeletedStudentLessons } from '../lessons/visibility.js';

export function getArchiveEntries(lessons = [], student) {
  return getArchivedStudentLessons(lessons, student);
}

export function getTrashEntries(lessons = [], student) {
  return getDeletedStudentLessons(lessons, student);
}

export function getAllArchiveEntries(lessons = []) {
  return lessons.filter(lesson => Boolean(lesson?.archived) && !lesson?.deleted);
}

export function getAllTrashEntries(lessons = []) {
  return lessons.filter(lesson => Boolean(lesson?.deleted));
}

export function canRestoreLesson(lesson) {
  return Boolean(lesson?.archived || lesson?.deleted);
}
