const DEFAULT_KEY = 'pacogo_agenda';

export function createAgendaStorage({ storage = globalThis.localStorage, key = DEFAULT_KEY } = {}) {
  function getItems(student) {
    if (!storage || !student) return [];
    try {
      const all = JSON.parse(storage.getItem(key) || '{}');
      return Array.isArray(all[student]) ? all[student] : [];
    } catch {
      return [];
    }
  }

  function saveItems(items, student) {
    if (!storage || !student) return;
    const all = JSON.parse(storage.getItem(key) || '{}');
    all[student] = Array.isArray(items) ? items : [];
    storage.setItem(key, JSON.stringify(all));
  }

  return Object.freeze({ getItems, saveItems, key });
}
