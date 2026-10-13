const STORAGE_KEY = 'pacogo_lesson_editor_draft';

function requireStorage(storage) {
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function' || typeof storage.removeItem !== 'function') {
    throw new Error('Lesson editor draft storage requires session storage.');
  }
  return storage;
}

export function createLessonEditorDraftStorage(storage = globalThis.sessionStorage) {
  const target = requireStorage(storage);

  return Object.freeze({
    save(draft) {
      if (!draft || typeof draft !== 'object') throw new Error('A lesson editor draft is required.');
      target.setItem(STORAGE_KEY, JSON.stringify(draft));
    },
    read() {
      const raw = target.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        target.removeItem(STORAGE_KEY);
        return null;
      }
    },
    clear() {
      target.removeItem(STORAGE_KEY);
    }
  });
}

export { STORAGE_KEY as LESSON_EDITOR_DRAFT_STORAGE_KEY };
