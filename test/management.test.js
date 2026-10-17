import test from 'node:test';
import assert from 'node:assert/strict';
import { appState, setViewContext, setLessons } from '../src/core/state.js';
import { createManagement } from '../src/features/management/management.js';

function makeService() {
  const lessons = [
    { id: 1, student: 'Zyon', title: 'Actief', archived: false, deleted: false },
    { id: 2, student: 'Zyon', title: 'Archief', archived: true, deleted: false },
    { id: 3, student: 'Zenith', title: 'Andere student', archived: false, deleted: false },
    { id: 4, student: 'Zenith', title: 'Prullenbak', archived: false, deleted: true }
  ];

  return {
    calls: [],
    async listAll() { return lessons.map(item => ({ ...item })); },
    async createLesson(payload) { this.calls.push(['create', payload]); return { id: 5, ...payload }; },
    async updateLesson(id, payload) { this.calls.push(['update', id, payload]); return { id, ...payload }; },
    async archive(id) { this.calls.push(['archive', id]); },
    async moveToTrash(id) { this.calls.push(['trash', id]); },
    async restore(id) { this.calls.push(['restore', id]); },
    async permanentlyDelete(id) { this.calls.push(['permanent-delete', id]); return 1; },
    async emptyTrash() { this.calls.push(['empty-trash']); return 1; }
  };
}

function makeFeedbackService() {
  return {
    calls: [],
    async listAll() { this.calls.push(['list']); return [{ id: 1, subject: 'Idee', status: 'new' }]; },
    async create(payload) { this.calls.push(['create', payload]); return { id: 2, ...payload, status: 'new' }; },
    async updateStatus(id, status) { this.calls.push(['status', id, status]); return { id, status }; }
  };
}

function makeLessonOrder() {
  return {
    async getOrderedLessons(lessons) { return lessons; },
    async writeOrder(student, subject, lessons) { return { student, subject, lessonIds: lessons.map(lesson => Number(lesson.id)) }; }
  };
}

function makeLoadLessons(service) {
  return async () => {
    const lessons = await service.listAll();
    setLessons(lessons);
    return lessons;
  };
}

function createManagementForTest(service = makeService(), overrides = {}) {
  return createManagement({
    auth: { isParent: true },
    lessonService: service,
    feedbackService: makeFeedbackService(),
    lessonOrder: makeLessonOrder(),
    loadLessons: makeLoadLessons(service),
    ...overrides
  });
}

test('management owns the student roster and scoped lesson operations', async () => {
  setViewContext('Zyon', 'management');
  appState.lessons = [];

  const service = makeService();
  const management = createManagementForTest(service);

  assert.deepEqual(management.getStudents(), ['Zyon', 'Zenith', 'Zephon']);
  const active = await management.loadLessons();
  assert.deepEqual(active.map(item => item.id), [1]);
  assert.deepEqual(management.getAllScopedLessons().map(item => item.id), [1, 2]);

  await management.createLesson({ title: 'Nieuw' });
  await management.updateLesson(1, { title: 'Bijgewerkt' });
  await management.archiveLesson(1);
  assert.deepEqual(service.calls, [
    ['create', { title: 'Nieuw', student: 'Zyon' }],
    ['update', 1, { title: 'Bijgewerkt', student: 'Zyon' }],
    ['archive', 1]
  ]);
});

test('management owns recovery read and restore operations across students', async () => {
  setViewContext('', 'student');
  appState.lessons = [];

  const service = makeService();
  const management = createManagementForTest(service);

  await management.loadRecoveryLessons();
  assert.deepEqual(management.getRecoveryLessons('archive').map(item => item.id), [2]);
  assert.deepEqual(management.getRecoveryLessons('trash').map(item => item.id), [4]);

  await management.restoreLesson(2);
  assert.deepEqual(service.calls, [['restore', 2]]);
  assert.throws(() => management.getRecoveryLessons('unknown'), /Unknown recovery mode/);
});

test('management permanently deletes only lessons in the trash', async () => {
  setViewContext('', 'student');
  appState.lessons = [];

  const service = makeService();
  const management = createManagementForTest(service);
  await management.loadRecoveryLessons();

  await management.permanentlyDeleteRecoveryLesson(4);
  await assert.rejects(() => management.permanentlyDeleteRecoveryLesson(2), /Only lessons in the trash/);
  assert.deepEqual(service.calls, [['permanent-delete', 4]]);
});

test('management owns parent feedback operations', async () => {
  setViewContext('', 'student');
  appState.lessons = [];

  const feedbackService = makeFeedbackService();
  const management = createManagement({
    auth: { isParent: true },
    lessonService: makeService(),
    feedbackService,
    lessonOrder: makeLessonOrder(),
    loadLessons: async () => []
  });

  assert.deepEqual(await management.listFeedback(), [{ id: 1, subject: 'Idee', status: 'new' }]);
  assert.deepEqual(await management.submitFeedback({ feedbackType: 'idea', subject: 'Nieuwe oefening', message: 'Meer breuken.' }), {
    id: 2,
    feedbackType: 'idea',
    subject: 'Nieuwe oefening',
    message: 'Meer breuken.',
    status: 'new'
  });
  assert.deepEqual(await management.updateFeedbackStatus(1, 'resolved'), { id: 1, status: 'resolved' });
  assert.deepEqual(feedbackService.calls, [
    ['list'],
    ['create', { feedbackType: 'idea', subject: 'Nieuwe oefening', message: 'Meer breuken.' }],
    ['status', 1, 'resolved']
  ]);
});

test('management rejects mutations outside the selected student scope', async () => {
  setViewContext('Zyon', 'management');
  appState.lessons = [];

  const service = makeService();
  const management = createManagementForTest(service);
  await management.loadLessons();

  await assert.rejects(() => management.updateLesson(3, { title: 'Niet toegestaan' }), /outside the selected student scope/);
  await assert.rejects(() => management.archiveLesson(3), /outside the selected student scope/);
  assert.deepEqual(service.calls, []);
});

test('management requires a management context and parent session', async () => {
  setViewContext('', 'student');
  const service = makeService();
  const management = createManagementForTest(service);
  await management.loadLessons().catch(error => assert.match(error.message, /student must be selected/));

  const nonParent = createManagement({ auth: { isParent: false }, lessonService: service, feedbackService: makeFeedbackService(), lessonOrder: makeLessonOrder(), loadLessons: makeLoadLessons(service) });
  await assert.rejects(() => nonParent.loadLessons(), /parent session/);
  await assert.rejects(() => nonParent.listFeedback(), /parent session/);
  assert.deepEqual(service.calls, []);
});

test('management requires the application lesson-state loader', () => {
  assert.throws(
    () => createManagement({
      auth: { isParent: true },
      lessonService: makeService(),
      feedbackService: makeFeedbackService(),
      lessonOrder: makeLessonOrder()
    }),
    /requires loadLessons/
  );
});
