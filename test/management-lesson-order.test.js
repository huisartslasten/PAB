import test from 'node:test';
import assert from 'node:assert/strict';
import { appState, setStudent, setLessons } from '../src/core/state.js';
import { createManagement } from '../src/features/management/management.js';

function createFixture() {
  const lessons = [
    { id: 1, student: 'Zyon', subject: 'Rekenen', subvak: 'Optellen', archived: false, deleted: false },
    { id: 2, student: 'Zyon', subject: 'Rekenen', subvak: 'Aftrekken', archived: false, deleted: false },
    { id: 3, student: 'Zyon', subject: 'Rekenen', subvak: 'Optellen', archived: false, deleted: false },
    { id: 4, student: 'Zyon', subject: 'Nederlands', subvak: '', archived: false, deleted: false }
  ];
  const writes = [];
  const updates = [];
  setStudent('Zyon');
  setLessons(lessons);

  const management = createManagement({
    auth: { isParent: true },
    lessonService: {
      updateLesson: async (id, payload) => {
        updates.push({ id, payload });
        const lesson = appState.lessons.find(item => Number(item.id) === Number(id));
        Object.assign(lesson, payload);
        return lesson;
      },
      createLesson: async payload => payload
    },
    feedbackService: {
      listAll: async () => [],
      create: async payload => payload,
      updateStatus: async () => undefined
    },
    lessonOrder: {
      getOrderedLessons: async (list, student, subject) => {
        assert.equal(student, 'Zyon');
        assert.ok(subject);
        return subject === 'Rekenen' ? [list[2], list[0], list[1]] : list;
      },
      writeOrder: async (student, subject, list) => {
        writes.push({ student, subject, ids: list.map(item => Number(item.id)) });
      }
    },
    loadLessons: async () => appState.lessons
  });

  return { management, writes, updates };
}

test('management orders each subject through the canonical lesson-order service', async () => {
  const { management } = createFixture();
  const groups = await management.getOrderedScopedLessons();
  assert.deepEqual(groups.map(group => group.subject), ['Nederlands', 'Rekenen']);
  assert.deepEqual(groups.find(group => group.subject === 'Rekenen').lessons.map(item => item.id), [3, 1, 2]);
});

test('management persists scoped subject order through the canonical service', async () => {
  const { management, writes } = createFixture();
  await management.saveLessonOrder('Rekenen', [{ id: 3 }, { id: 1 }, { id: 2 }]);
  assert.deepEqual(writes, [{ student: 'Zyon', subject: 'Rekenen', ids: [3, 1, 2] }]);
});

test('management owns lesson subvak movement and refreshes scoped state', async () => {
  const { management, updates } = createFixture();
  await management.moveLessonToSubvak(1, 'Vermenigvuldigen');
  assert.deepEqual(updates, [{ id: 1, payload: { subvak: 'Vermenigvuldigen', student: 'Zyon' } }]);
  assert.equal(appState.lessons.find(item => item.id === 1).subvak, 'Vermenigvuldigen');
});
