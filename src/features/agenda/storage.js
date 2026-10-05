// Storage adapter only. The V4.78 agenda persistence contract is not assumed here.
// The caller must provide the exact storage key once it has been verified.

export function createAgendaStorage({ storage = globalThis.localStorage, key } = {}) {
  if (!key) throw new Error('createAgendaStorage requires the verified storage key');

  function readAll() {
    try { return JSON.parse(storage?.getItem(key) || '{}'); }
    catch { return {}; }
  }

  function getItems(student) {
    if (!storage || !student) return [];
    const all = readAll();
    return Array.isArray(all[student]) ? all[student] : [];
  }

  function saveItems(items, student) {
    if (!storage || !student) return;
    const all = readAll();
    all[student] = Array.isArray(items) ? items : [];
    storage.setItem(key, JSON.stringify(all));
  }

  return Object.freeze({ getItems, saveItems, key });
}
