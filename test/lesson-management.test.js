import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonManagement } from '../src/features/lessons/lesson-management.js';

function createServiceMock() {
  const calls = [];
  return {
    calls,
    async createLesson(lesson) {
      calls.push({ op: 'createLesson', lesson });
      return { id: 42, ...lesson };
    },
    async updateLesson(id, lesson) {
      calls.push({ op: 'updateLesson', id, lesson });
      return { id, ...lesson };
    },
    async replaceLessonItems(lessonId, items) {
      calls.push({ op: 'replaceLessonItems', lessonId, items });
      return items;
    },
    async archive(id) {
      calls.push({ op: 'archive', id });
    },
    async moveToTrash(id) {
      calls.push({ op: 'moveToTrash', id });
    },
    async restore(id) {
      calls.push({ op: 'restore', id });
    }
  };
}

test('lesson management blocks all mutations for non-parent sessions', async () => {
  const service = createServiceMock();
  const management = createLessonManagement({ service, auth: { isParent: false } });

  await assert.rejects(
    management.create({ lesson: { title: 'Test' }, items: [] }),
    /Alleen ouders kunnen lessen wijzigen\./
  );
  await assert.rejects(management.update(1, { lesson: {}, items: [] }), /Alleen ouders/);
  await assert.rejects(management.archive(1), /Alleen ouders/);
  await assert.rejects(management.moveToTrash(1), /Alleen ouders/);
  await assert.rejects(management.restore(1), /Alleen ouders/);

  assert.deepEqual(service.calls, []);
});

test('lesson management creates the lesson and then replaces its items', async () => {
  const service = createServiceMock();
  const management = createLessonManagement({ service, auth: { isParent: true } });

  const result = await management.create({
    lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Woorden' },
    items: [{ prompt: 'boom' }]
  });

  assert.equal(result.id, 42);
  assert.deepEqual(service.calls, [
    {
      op: 'createLesson',
      lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Woorden' }
    },
    {
      op: 'replaceLessonItems',
      lessonId: 42,
      items: [{ prompt: 'boom' }]
    }
  ]);
});

test('lesson management updates the lesson and then replaces its items', async () => {
  const service = createServiceMock();
  const management = createLessonManagement({ service, auth: { isParent: true } });

  await management.update(7, {
    lesson: { title: 'Nieuwe titel' },
    items: [{ prompt: 'huis' }, { prompt: 'boom' }]
  });

  assert.deepEqual(service.calls, [
    { op: 'updateLesson', id: 7, lesson: { title: 'Nieuwe titel' } },
    {
      op: 'replaceLessonItems',
      lessonId: 7,
      items: [{ prompt: 'huis' }, { prompt: 'boom' }]
    }
  ]);
});

test('lesson management preserves the parent-only archive, trash and restore boundary', async () => {
  const service = createServiceMock();
  const management = createLessonManagement({ service, auth: { isParent: true } });

  await management.archive(1);
  await management.moveToTrash(2);
  await management.restore(3);

  assert.deepEqual(service.calls, [
    { op: 'archive', id: 1 },
    { op: 'moveToTrash', id: 2 },
    { op: 'restore', id: 3 }
  ]);
});
