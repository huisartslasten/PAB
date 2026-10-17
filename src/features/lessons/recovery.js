import { getArchivedStudentLessons, getDeletedStudentLessons } from './visibility.js';

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

export function createLessonRecovery({ lessonService, refresh = async () => {} } = {}) {
  if (!lessonService) throw new Error('createLessonRecovery requires lessonService');

  async function archive(id) {
    const result = await lessonService.archive(id);
    await refresh();
    return result;
  }

  async function trash(id) {
    const result = await lessonService.moveToTrash(id);
    await refresh();
    return result;
  }

  async function restore(id) {
    const result = await lessonService.restore(id);
    await refresh();
    return result;
  }

  return Object.freeze({ archive, trash, restore });
}

export function createTrashRecovery({ lessonService, refresh = async () => {} } = {}) {
  if (!lessonService) throw new Error('createTrashRecovery requires lessonService');

  async function emptyTrash() {
    const deletedCount = await lessonService.emptyTrash();
    await refresh();
    return deletedCount;
  }

  return Object.freeze({ emptyTrash });
}
