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
  const lessonService = {
    async restore(id) {
      const lesson = lessons.find(item => item.id === id);
      lesson.archived = false;
      lesson.deleted = false;
      return lesson;
    },
    async archive() {},
    async moveToTrash() {},
    async emptyTrash() {},
    async createLesson() {},
    async updateLesson() {}
  };

  const management = createManagement({
    auth: { isParent: true },
    lessonService,
    feedbackService: {
      async listAll() { return []; },
      async create() {},
      async updateStatus() {}
    },
    lessonOrder: {
      async getOrderedLessons(items) { return items; },
      async writeOrder() {}
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

test('recovery restore does not require or change the selected student', async () => {
  appState.currentStudent = null;
  const { management, lessons } = createFixture();
  await management.loadRecoveryLessons();

  await management.restoreRecoveryLesson(1);

  assert.equal(lessons[0].archived, false);
  assert.equal(lessons[0].deleted, false);
  assert.equal(appState.currentStudent, null);
});
