// Deterministic lesson-order persistence boundary.
// Contract source: TEST V4.78 getOrderedLessons()/saveLessonOrder().

function requireDb(db) {
  if (!db || typeof db.from !== 'function') {
    throw new Error('A Supabase client is required.');
  }
}

function requireStorage(storage) {
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    throw new Error('A storage implementation is required.');
  }
}

export function applyLessonOrder(list, saved) {
  const rank = new Map((Array.isArray(saved) ? saved : []).map((id, index) => [Number(id), index]));
  return [...(Array.isArray(list) ? list : [])].sort((a, b) => {
    const ar = rank.has(Number(a.id)) ? rank.get(Number(a.id)) : 999999;
    const br = rank.has(Number(b.id)) ? rank.get(Number(b.id)) : 999999;
    return ar - br || Number(a.id) - Number(b.id);
  });
}

export function createLessonOrderService({ db, storage } = {}) {
  requireDb(db);
  requireStorage(storage);

  function storageKey(student, subject) {
    return 'pacogo-lesson-order-' + String(student || '') + '-' + String(subject || '');
  }

  function readLocalOrder(student, subject) {
    try {
      const saved = JSON.parse(storage.getItem(storageKey(student, subject)) || '[]');
      return Array.isArray(saved) ? saved.map(Number) : [];
    } catch {
      return [];
    }
  }

  async function readOrder(student, subject) {
    const { data, error } = await db
      .from('lesson_order')
      .select('lesson_id,position')
      .eq('student', student)
      .eq('subject', subject)
      .order('position', { ascending: true });

    if (!error && data?.length) {
      return data.map(row => Number(row.lesson_id));
    }

    return readLocalOrder(student, subject);
  }

  async function writeOrder(student, subject, list, { persistRemote = true } = {}) {
    const ids = (Array.isArray(list) ? list : []).map(lesson => Number(lesson.id));

    try {
      storage.setItem(storageKey(student, subject), JSON.stringify(ids));
    } catch {
      // Preserve V4.78 behavior: localStorage failures were intentionally ignored here.
    }

    if (!persistRemote || !student || !subject || !ids.length) return;

    const removed = await db.from('lesson_order').delete().eq('student', student).eq('subject', subject);
    if (removed.error) throw removed.error;

    const rows = ids.map((lesson_id, position) => ({ student, subject, lesson_id, position }));
    const inserted = await db.from('lesson_order').insert(rows);
    if (inserted.error) throw inserted.error;
  }

  return Object.freeze({
    readOrder,
    writeOrder,
    applyLessonOrder: (list, saved) => applyLessonOrder(list, saved)
  });
}
