const STORAGE_KEY = 'pacogo_test_calendar';

export function createTestCalendarStorage(storage = globalThis.localStorage) {
  return Object.freeze({
    getAll() {
      try { return JSON.parse(storage.getItem(STORAGE_KEY) || '[]'); }
      catch { return []; }
    },
    save(items) {
      storage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(items) ? items : []));
    }
  });
}

export function getUpcomingTests(items = [], student, today = new Date()) {
  const todayKey = new Date(today).toISOString().slice(0, 10);
  return (Array.isArray(items) ? items : [])
    .filter(item => item.student === student && item.date >= todayKey)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(0, 4);
}

export function upsertTestDate(items = [], { lessonId, student, date, lesson }) {
  if (!date) return Array.isArray(items) ? [...items] : [];
  const result = Array.isArray(items) ? [...items] : [];
  const index = result.findIndex(item => Number(item.lessonId) === Number(lessonId) && item.student === student);
  const previous = index >= 0 ? result[index] : null;
  const entry = {
    id: previous?.id || Date.now().toString(), student, lessonId: Number(lessonId),
    subject: lesson?.subject || '', title: lesson?.title || '', date
  };
  if (index >= 0) result[index] = entry; else result.push(entry);
  return result;
}
