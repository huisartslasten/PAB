import { appState, setStudent } from '../../core/state.js';
import { getActiveStudentLessons, getStudentLessons } from '../lessons/visibility.js';
import { createLessonRecovery } from '../lessons/recovery.js';
import { getAllArchiveEntries, getAllTrashEntries } from './recovery.js';
import { isKnownStudent, listStudents } from '../students/students.js';

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

export function createManagement({ auth, lessonService, feedbackService, loadLessons } = {}) {
  if (!lessonService) throw new Error('createManagement requires lessonService');
  if (!feedbackService) throw new Error('createManagement requires feedbackService');
  if (typeof loadLessons !== 'function') throw new Error('createManagement requires loadLessons');

  function assertParent() {
    requireParent(auth);
  }

  async function refreshLessons() {
    assertParent();
    await loadLessons();
    return getScopedLessons();
  }

  function selectStudent(student) {
    assertParent();
    const value = String(student ?? '').trim();
    if (!value || !isKnownStudent(value)) throw new Error('A known student must be selected.');
    setStudent(value);
    return value;
  }

  function getStudents() {
    assertParent();
    return listStudents();
  }

  function getSelectedStudent() {
    assertParent();
    return appState.currentStudent;
  }

  function getScopedLessons() {
    assertParent();
    return getActiveStudentLessons(appState.lessons, requireStudent());
  }

  function getAllScopedLessons() {
    assertParent();
    return getStudentLessons(appState.lessons, requireStudent());
  }

  function getRecoveryLessons(mode) {
    assertParent();
    if (mode === 'archive') return getAllArchiveEntries(appState.lessons);
    if (mode === 'trash') return getAllTrashEntries(appState.lessons);
    throw new Error('Unknown recovery mode.');
  }

  async function createLesson(payload = {}) {
    assertParent();
    const student = requireStudent();
    const result = await lessonService.createLesson({ ...payload, student });
    await refreshLessons();
    return result;
  }

  async function updateLesson(id, payload = {}) {
    assertParent();
    const student = requireStudent();
    findScopedLesson(id, student);
    const result = await lessonService.updateLesson(id, { ...payload, student });
    await refreshLessons();
    return result;
  }

  const recovery = createLessonRecovery({
    lessonService,
    refresh: refreshLessons
  });

  async function archiveLesson(id) {
    assertParent();
    findScopedLesson(id, requireStudent());
    return recovery.archive(id);
  }

  async function moveToTrash(id) {
    assertParent();
    findScopedLesson(id, requireStudent());
    return recovery.trash(id);
  }

  async function restoreLesson(id) {
    assertParent();
    const lesson = findScopedLesson(id, requireStudent());
    if (!lesson.archived && !lesson.deleted) throw new Error('Lesson is not recoverable.');
    return recovery.restore(id);
  }

  async function listFeedback() {
    assertParent();
    return feedbackService.listAll();
  }

  async function submitFeedback(payload = {}) {
    assertParent();
    return feedbackService.create(payload);
  }

  async function updateFeedbackStatus(id, status) {
    assertParent();
    return feedbackService.updateStatus(id, status);
  }

  return Object.freeze({
    getStudents,
    selectStudent,
    getSelectedStudent,
    loadLessons: refreshLessons,
    getScopedLessons,
    getAllScopedLessons,
    getRecoveryLessons,
    createLesson,
    updateLesson,
    archiveLesson,
    moveToTrash,
    restoreLesson,
    listFeedback,
    submitFeedback,
    updateFeedbackStatus
  });
}
