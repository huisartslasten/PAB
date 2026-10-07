import { agendaEventsAreDuplicate, normalizeAgendaDate } from './merge.js';

export function addAgendaItems(existing = [], candidates = []) {
  const current = Array.isArray(existing) ? [...existing] : [];
  const added = [];
  for (const candidate of Array.isArray(candidates) ? candidates : []) {
    if (!candidate?.date || !candidate?.title) continue;
    const normalized = { ...candidate, date: normalizeAgendaDate(candidate.date) };
    if (current.some(item => agendaEventsAreDuplicate(item, normalized))) continue;
    current.push(normalized);
    added.push(normalized);
  }
  return { items: current, added };
}

export function createAgendaImportItem({ index = 0, student, date, type = 'other', title = 'Agenda-afspraak', meta = '', source = '', createdAt } = {}) {
  return {
    id: 'agenda_' + Date.now() + '_' + index,
    student,
    date: normalizeAgendaDate(date),
    type: type || 'other',
    title: String(title || '').trim() || 'Agenda-afspraak',
    meta: meta || '',
    source: source || '',
    createdAt: createdAt || new Date().toISOString()
  };
}
