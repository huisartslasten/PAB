// Persistence boundary for the Double or Nothing personal record.
// This game currently has no Supabase table contract, so the record is deliberately
// scoped to the browser and kept outside the game runtime.

const PREFIX = 'pacogo.double-or-nothing.record';

function keyFor(student, lessonId) {
  return `${PREFIX}:${String(student || '').trim()}:${String(lessonId || '').trim()}`;
}

export function createDoubleOrNothingRecordStore({ storage = globalThis.localStorage } = {}) {
  function read(student, lessonId) {
    if (!storage) return 0;
    const value = Number(storage.getItem(keyFor(student, lessonId)) || 0);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  }

  function save(student, lessonId, score) {
    const current = read(student, lessonId);
    const next = Math.max(current, Math.floor(Number(score) || 0));
    if (storage && next > current) storage.setItem(keyFor(student, lessonId), String(next));
    return next;
  }

  return Object.freeze({ read, save });
}
