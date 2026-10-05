// Lesson-management boundary.
//
// V4.78 authorization is explicit at the UI/action boundary: lesson changes
// start with requireParent(), which permits only a logged-in parent session.
// This module captures that rule without wiring the new boundary into runtime.
// The legacy implementation remains the behavioral reference until parity is
// fully verified.

function assertParent(auth) {
  if (!auth?.isParent) {
    throw new Error('Alleen ouders kunnen lessen wijzigen.');
  }
}

function normalizeItems(items) {
  return Array.isArray(items) ? items : [];
}

export function createLessonManagement({ service, auth }) {
  if (!service) throw new Error('A lesson service is required.');

  return Object.freeze({
    async create({ lesson, items = [] }) {
      assertParent(auth);
      const created = await service.createLesson(lesson);
      await service.replaceLessonItems(created.id, normalizeItems(items));
      return created;
    },

    async update(id, { lesson, items = [] }) {
      assertParent(auth);
      const updated = await service.updateLesson(id, lesson);
      await service.replaceLessonItems(id, normalizeItems(items));
      return updated;
    },

    async archive(id) {
      assertParent(auth);
      return service.archive(id);
    },

    async moveToTrash(id) {
      assertParent(auth);
      return service.moveToTrash(id);
    },

    async restore(id) {
      assertParent(auth);
      return service.restore(id);
    }
  });
}
