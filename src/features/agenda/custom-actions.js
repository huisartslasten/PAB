import { createCustomAgendaStorage } from './custom-storage.js';

function key(date) {
  const d = date instanceof Date ? new Date(date) : new Date(`${date}T12:00:00`);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}

export function createAgendaCustomActions({ storage = globalThis.localStorage, documentRef = globalThis.document, currentStudent = () => '', onChanged = () => {} } = {}) {
  const customStorage = createCustomAgendaStorage(storage);
  let editId = null;

  function editAgendaItem(id) {
    const items = customStorage.getItems(currentStudent());
    const item = items.find(entry => entry?.id === id);
    if (!item) return false;
    editId = id;
    const period = Boolean(item.periodId) || item.source === 'handmatig-periode';
    const set = (elementId, value) => { const element = documentRef?.getElementById(elementId); if (element) element.value = value ?? ''; };
    const toggle = (elementId, hidden) => documentRef?.getElementById(elementId)?.classList.toggle('hidden', hidden);
    set('agendaEditTitle', item.title);
    set('agendaEditType', item.type || 'other');
    set('agendaEditMeta', item.meta);
    set('agendaEditTime', item.time);
    toggle('agendaEditSingleFields', period);
    toggle('agendaEditRangeFields', !period);
    if (period) {
      const group = items.filter(entry => (entry.periodId || entry.id) === item.periodId);
      set('agendaEditStartDate', item.periodStart || group.map(entry => entry.date).sort()[0] || item.date);
      set('agendaEditEndDate', item.periodEnd || group.map(entry => entry.date).sort().slice(-1)[0] || item.date);
    } else {
      set('agendaEditDate', item.date);
    }
    documentRef?.getElementById('agendaEditModal')?.classList.remove('hidden');
    return true;
  }

  function closeAgendaEditModal() {
    editId = null;
    documentRef?.getElementById('agendaEditModal')?.classList.add('hidden');
  }

  function saveAgendaEditModal() {
    if (!editId) return false;
    const student = currentStudent();
    const items = customStorage.getItems(student);
    const item = items.find(entry => entry?.id === editId);
    if (!item) return false;
    const value = id => String(documentRef?.getElementById(id)?.value || '').trim();
    const title = value('agendaEditTitle');
    if (!title) return false;
    const type = value('agendaEditType') || 'other';
    const meta = value('agendaEditMeta');
    const time = value('agendaEditTime');
    const allItems = (() => {
      try { return JSON.parse(storage?.getItem(customStorage.key) || '[]'); } catch { return []; }
    })();
    let next;
    if (item.periodId) {
      const startDate = value('agendaEditStartDate');
      const endDate = value('agendaEditEndDate');
      if (!startDate || !endDate || endDate < startDate) return false;
      const others = allItems.filter(entry => entry?.student !== student || entry?.periodId !== item.periodId);
      const created = [];
      const start = new Date(`${startDate}T12:00:00`);
      const end = new Date(`${endDate}T12:00:00`);
      for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateKey = key(date);
        created.push({ ...item, id: `${item.periodId}_${dateKey}`, date: dateKey, title, type, meta, time, periodStart: startDate, periodEnd: endDate });
      }
      next = [...others, ...created];
    } else {
      const date = value('agendaEditDate');
      if (!date) return false;
      next = allItems.map(entry => entry?.id === item.id ? { ...entry, date, title, type, meta, time } : entry);
    }
    customStorage.saveItems(next.filter(entry => entry?.student === student), student);
    closeAgendaEditModal();
    onChanged();
    return true;
  }

  function deleteAgendaItem(id) {
    const student = currentStudent();
    const items = customStorage.getItems(student);
    if (!items.some(entry => entry?.id === id)) return false;
    const confirmed = typeof globalThis.confirm === 'function' ? globalThis.confirm('Deze agenda-afspraak verwijderen?') : true;
    if (!confirmed) return false;
    customStorage.saveItems(items.filter(entry => entry?.id !== id), student);
    onChanged();
    return true;
  }

  return Object.freeze({ editAgendaItem, closeAgendaEditModal, saveAgendaEditModal, deleteAgendaItem });
}
