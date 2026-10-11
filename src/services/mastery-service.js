/** Canonical local mastery state boundary for student progress. */
export function createMasteryService({ storage = globalThis.localStorage } = {}) {
  function key(student, lessonId, itemId) {
    return `pacogo_mastery_${student}_${lessonId}_${itemId}`;
  }

  function get(student, lessonId, itemId) {
    try {
      return JSON.parse(storage.getItem(key(student, lessonId, itemId)) || '{"streak":0,"mastered":false}');
    } catch {
      return { streak: 0, mastered: false };
    }
  }

  function save(student, lessonId, itemId, streak) {
    const normalized = Math.max(0, Number(streak) || 0);
    storage.setItem(key(student, lessonId, itemId), JSON.stringify({
      streak: normalized,
      mastered: normalized >= 3
    }));
  }

  function record(student, lessonId, itemId, correct) {
    const current = get(student, lessonId, itemId);
    const streak = correct ? Math.min(3, (current.streak || 0) + 1) : 0;
    save(student, lessonId, itemId, streak);
    return get(student, lessonId, itemId);
  }

  return Object.freeze({ get, save, record });
}
