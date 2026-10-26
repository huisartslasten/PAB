import { appState } from '../../core/state.js';
import { getViewContext } from '../../core/view-context.js';
import { getActiveStudentLessons, getStudentLessons } from '../lessons/visibility.js';
import { createLessonRecovery, createTrashRecovery } from '../lessons/recovery.js';
import { getAllArchiveEntries, getAllTrashEntries } from './recovery.js';
import { listStudents } from '../students/students.js';

function requireParent(auth) {
  if (!auth?.isParent) throw new Error('Management requires a parent session.');
}

function requireStudent() {
  const { student, isManagement } = getViewContext();
  if (!student || !isManagement) throw new Error('A student must be selected.');
  return student;
}

function findScopedLesson(id, student) {
  const lesson = appState.lessons.find(item => String(item?.id) === String(id));
  if (!lesson || !lesson.student || String(lesson.student).trim().toLowerCase() !== String(student).trim().toLowerCase()) {
    throw new Error('Lesson is outside the selected student scope.');
  }
  return lesson;
}

function findRecoveryLesson(id) {
  const lesson = appState.lessons.find(item => String(item?.id) === String(id));
  if (!lesson || (!lesson.archived && !lesson.deleted)) throw new Error('Lesson is not recoverable.');
  return lesson;
}

function normalizeSubject(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('nl-NL');
}

export function createManagement({ auth, lessonService, feedbackService, lessonOrder, loadLessons, learningTopics, skillDefinitions } = {}) {
  if (!lessonService) throw new Error('createManagement requires lessonService');
  if (!feedbackService) throw new Error('createManagement requires feedbackService');
  if (!lessonOrder) throw new Error('createManagement requires lessonOrder');
  if (typeof loadLessons !== 'function') throw new Error('createManagement requires loadLessons');
  if (!learningTopics) throw new Error('createManagement requires learningTopics');
  if (!skillDefinitions) throw new Error('createManagement requires skillDefinitions');

  function assertParent() { requireParent(auth); }

  async function loadAllLessons() {
    assertParent();
    await loadLessons();
    return appState.lessons;
  }

  async function refreshLessons() {
    assertParent();
    await loadLessons();
    return getScopedLessons();
  }

  async function refreshRecoveryLessons() {
    assertParent();
    await loadLessons();
    return {
      archive: getAllArchiveEntries(appState.lessons),
      trash: getAllTrashEntries(appState.lessons)
    };
  }

  async function refreshRecoveryLearningTopics() {
    assertParent();
    return {
      archive: await learningTopics.listRecovery('archive'),
      trash: await learningTopics.listRecovery('trash')
    };
  }

  async function refreshRecoverySkills() {
    assertParent();
    return {
      archive: await skillDefinitions.listRecovery('archive'),
      trash: await skillDefinitions.listRecovery('trash')
    };
  }

  function getStudents() { assertParent(); return listStudents(); }
  function getScopedLessons() { assertParent(); return getActiveStudentLessons(appState.lessons, requireStudent()); }
  function getAllScopedLessons() { assertParent(); return getStudentLessons(appState.lessons, requireStudent()); }

  async function getOrderedScopedLessons() {
    assertParent();
    const student = requireStudent();
    const lessons = getScopedLessons();
    const subjects = new Map();
    lessons.forEach(lesson => {
      const key = normalizeSubject(lesson.subject);
      if (!key) return;
      if (!subjects.has(key)) subjects.set(key, { subject: String(lesson.subject || '').trim(), lessons: [] });
      subjects.get(key).lessons.push(lesson);
    });
    const groups = [];
    for (const group of subjects.values()) {
      groups.push({ subject: group.subject, lessons: await lessonOrder.getOrderedLessons(group.lessons, student, group.subject) });
    }
    return groups.sort((a, b) => a.subject.localeCompare(b.subject, 'nl'));
  }

  async function saveLessonOrder(subject, lessons) {
    assertParent();
    const student = requireStudent();
    const scoped = (Array.isArray(lessons) ? lessons : []).map(lesson => findScopedLesson(lesson.id, student));
    if (scoped.some(lesson => normalizeSubject(lesson.subject) !== normalizeSubject(subject))) throw new Error('Lesson order contains a lesson outside the selected subject.');
    return lessonOrder.writeOrder(student, String(subject || '').trim(), scoped);
  }

  async function moveLessonToSubvak(id, subvak = '') {
    assertParent();
    const student = requireStudent();
    findScopedLesson(id, student);
    const result = await lessonService.updateLesson(id, { subvak: String(subvak ?? '').trim(), student });
    await refreshLessons();
    return result;
  }

  function getRecoveryLessons(mode) {
    assertParent();
    if (mode === 'archive') return getAllArchiveEntries(appState.lessons);
    if (mode === 'trash') return getAllTrashEntries(appState.lessons);
    throw new Error('Unknown recovery mode.');
  }

  async function createLesson(payload = {}) { assertParent(); const student = requireStudent(); const result = await lessonService.createLesson({ ...payload, student }); await refreshLessons(); return result; }
  async function updateLesson(id, payload = {}) { assertParent(); const student = requireStudent(); findScopedLesson(id, student); const result = await lessonService.updateLesson(id, { ...payload, student }); await refreshLessons(); return result; }

  const recovery = createLessonRecovery({ lessonService, refresh: refreshRecoveryLessons });
  const trashRecovery = createTrashRecovery({ lessonService, refresh: refreshRecoveryLessons });

  async function archiveLesson(id) { assertParent(); findScopedLesson(id, requireStudent()); return recovery.archive(id); }
  async function moveToTrash(id) { assertParent(); findScopedLesson(id, requireStudent()); return recovery.trash(id); }
  async function restoreLesson(id) { assertParent(); findRecoveryLesson(id); return recovery.restore(id); }
  async function permanentlyDeleteRecoveryLesson(id) { assertParent(); const lesson = appState.lessons.find(item => String(item?.id) === String(id)); if (!lesson?.deleted) throw new Error('Only lessons in the trash can be permanently deleted.'); return trashRecovery.permanentlyDelete(id); }
  async function emptyTrash() { assertParent(); return trashRecovery.emptyTrash(); }

  async function archiveLearningTopic(id) { assertParent(); return learningTopics.archive(id); }
  async function moveLearningTopicToTrash(id) { assertParent(); return learningTopics.moveToTrash(id); }
  async function restoreLearningTopic(id) { assertParent(); return learningTopics.restore(id); }
  async function permanentlyDeleteLearningTopic(id) { assertParent(); return learningTopics.permanentlyDelete(id); }
  async function emptyLearningTopicTrash() { assertParent(); return learningTopics.emptyTrash(); }
  async function getRecoveryLearningTopics(mode) { assertParent(); return learningTopics.listRecovery(mode); }

  async function archiveSkill(id) { assertParent(); return skillDefinitions.archive(id); }
  async function moveSkillToTrash(id) { assertParent(); return skillDefinitions.moveToTrash(id); }
  async function restoreSkillFromArchive(id) { assertParent(); return skillDefinitions.restoreFromArchive(id); }
  async function restoreSkillFromTrash(id) { assertParent(); return skillDefinitions.restoreFromTrash(id); }
  async function permanentlyDeleteSkill(id) { assertParent(); return skillDefinitions.permanentlyDelete(id); }
  async function getRecoverySkills(mode) { assertParent(); return skillDefinitions.listRecovery(mode); }

  async function listFeedback() { assertParent(); return feedbackService.listAll(); }
  async function submitFeedback(payload = {}) { assertParent(); return feedbackService.create(payload); }
  async function updateFeedbackStatus(id, status) { assertParent(); return feedbackService.updateStatus(id, status); }

  return Object.freeze({
    getStudents, loadAllLessons, loadLessons: refreshLessons, loadRecoveryLessons: refreshRecoveryLessons, refreshRecoveryLearningTopics, refreshRecoverySkills,
    getScopedLessons, getAllScopedLessons, getOrderedScopedLessons, saveLessonOrder, moveLessonToSubvak, getRecoveryLessons,
    createLesson, updateLesson, archiveLesson, moveToTrash, restoreLesson, permanentlyDeleteRecoveryLesson, emptyTrash,
    archiveLearningTopic, moveLearningTopicToTrash, restoreLearningTopic, permanentlyDeleteLearningTopic, emptyLearningTopicTrash, getRecoveryLearningTopics,
    archiveSkill, moveSkillToTrash, restoreSkillFromArchive, restoreSkillFromTrash, permanentlyDeleteSkill, getRecoverySkills,
    listFeedback, submitFeedback, updateFeedbackStatus
  });
}
