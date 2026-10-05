const STORAGE_KEY = 'pacogo_agenda_items';

function readAll(storage) {
  try {
    const value = storage?.getItem(STORAGE_KEY);
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function createCustomAgendaStorage(storage = globalThis.localStorage) {
  function getItems(student) {
    if (!student) return [];
    return readAll(storage).filter(item => item?.student === student);
  }

  function saveItems(items, student) {
    if (!student) return;
    const all = readAll(storage);
    const others = all.filter(item => item?.student !== student);
    const next = Array.isArray(items) ? items : [];
    storage.setItem(STORAGE_KEY, JSON.stringify([...others, ...next]));
  }

  return Object.freeze({ getItems, saveItems, key: STORAGE_KEY });
}
