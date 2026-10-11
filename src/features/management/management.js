import { appState, setLessons, setStudent } from '../../core/state.js';
import { getActiveStudentLessons, getStudentLessons } from '../lessons/visibility.js';
import { createLessonRecovery } from '../lessons/recovery.js';

function requireParent(auth) {
  if (!auth?.isParent) throw new Error('Management requires a parent session.');
}

function requireStudent() {
  if (!appState.currentStudent) throw new Error('A student must be selected.');
  return appState.currentStudent;
}

function findScopedLesson(id, student) {
  const lesson = appState.lessons.find(item => String(item?.id) === String(id));
  if (!lesson || !lesson.student || String(lesson.student).trim().toLowerCase() !== String(student).trim().toLowerCase()) {
    throw new Error('Lesson is outside the selected student scope.');
  }
  return lesson;
}

export function createManagement({ auth, lessonService } = {}) {
  requireParent(auth);
  if (!lessonService) throw new Error('createManagement requires lessonService');

  async function loadLessons() {
    const lessons = await lessonService.listAll();
    setLessons(lessons);
    return getScopedLessons();
  }

  function selectStudent(student) {
    const value = String(student ?? '').trim();
    if (!value) throw new Error('A student must be selected.');
    setStudent(value);
    return value;
  }

  function getSelectedStudent() {
    return appState.currentStudent;
  }

  function getScopedLessons() {
    return getActiveStudentLessons(appState.lessons, requireStudent());
  }

  function getAllScopedLessons() {
    return getStudentLessons(appState.lessons, requireStudent());
  }

  async function createLesson(payload = {}) {
    const student = requireStudent();
    const result = await lessonService.createLesson({ ...payload, student });
    await loadLessons();
    return result;
  }

  async function updateLesson(id, payload = {}) {
    const student = requireStudent();
    findScopedLesson(id, student);
    const result = await lessonService.updateLesson(id, { ...payload, student });
    await loadLessons();
    return result;
  }

  const recovery = createLessonRecovery({
    lessonService,
    refresh: loadLessons
  });

  async function archiveLesson(id) {
    findScopedLesson(id, requireStudent());
    return recovery.archive(id);
  }

  async function moveToTrash(id) {
    findScopedLesson(id, requireStudent());
    return recovery.trash(id);
  }

  async function restoreLesson(id) {
    const lesson = findScopedLesson(id, requireStudent());
    if (!lesson.archived && !lesson.deleted) throw new Error('Lesson is not recoverable.');
    return recovery.restore(id);
  }

  return Object.freeze({
    selectStudent,
    getSelectedStudent,
    loadLessons,
    getScopedLessons,
    getAllScopedLessons,
    createLesson,
    updateLesson,
    archiveLesson,
    moveToTrash,
    restoreLesson
  });
}
