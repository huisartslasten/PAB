import { createTestCalendarStorage, getUpcomingTests, upsertTestDate } from './test-calendar.js';

export function createTestCalendarService({ storage = globalThis.localStorage } = {}) {
  const calendar = createTestCalendarStorage(storage);

  function list(student, today = new Date()) {
    return getUpcomingTests(calendar.getAll(), student, today);
  }

  function save(items) {
    calendar.save(items);
    return items;
  }

  function setTestDate({ lessonId, student, date, lesson } = {}) {
    const next = upsertTestDate(calendar.getAll(), { lessonId, student, date, lesson });
    calendar.save(next);
    return next;
  }

  return Object.freeze({ list, save, setTestDate });
}
