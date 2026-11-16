import test from 'node:test';
import assert from 'node:assert/strict';
import { appState } from '../src/core/state.js';
import { createManagement } from '../src/features/management/management.js';

function createFixture() {
  const lessons = [
    { id: 1, student: 'Zyon', title: 'Breuken', archived: true, deleted: false },
    { id: 2, student: 'Zenith', title: 'Engels', archived: false, deleted: true },
    { id: 3, student: 'Zyon', title: 'Actief', archived: false, deleted: false }
  ];

  let loaded = 0;
  const management = createManagement({
    auth: { isParent: true },
    lessonService: {
      async restore() {},
      async archive() {},
      async moveToTrash() {},
      async permanentlyDelete(id) {
        const index = lessons.findIndex(item => item.id === id);
        if (index >= 0) lessons.splice(index, 1);
        return index >= 0 ? 1 : 0;
      },
      async emptyTrash() {},
      async createLesson() {},
      async updateLesson() {}
    },
    feedbackService: {
      async listAll() { return []; },
      async create() {},
      async updateStatus() {}
    },
    lessonOrder: {
      async getOrderedLessons(items) { return items; },
      async writeOrder() {}
    },
    learningTopics: {
      listRecovery: async () => ({ archive: [], trash: [] })
    },
    async loadLessons() {
      loaded += 1;
      appState.lessons = lessons;
    }
  });

  return { management, lessons, getLoaded: () => loaded };
}

test('recovery can load all students without selecting a student', async () => {
  appState.currentStudent = null;
  const { management, getLoaded } = createFixture();

  const result = await management.loadRecoveryLessons();

  assert.deepEqual(result.archive.map(lesson => lesson.student), ['Zyon']);
  assert.deepEqual(result.trash.map(lesson => lesson.student), ['Zenith']);
  assert.equal(appState.currentStudent, null);
  assert.equal(getLoaded(), 1);
});

test('recovery can permanently delete one trashed lesson without selecting a student', async () => {
  appState.currentStudent = null;
  const { management, lessons } = createFixture();

  await management.loadRecoveryLessons();
  const deletedCount = await management.permanentlyDeleteRecoveryLesson(2);

  assert.equal(deletedCount, 1);
  assert.equal(lessons.some(lesson => lesson.id === 2), false);
  assert.equal(appState.currentStudent, null);
});