export function addAgendaItems(existing = [], candidates = []) {
  const current = Array.isArray(existing) ? [...existing] : [];
  const added = Array.isArray(candidates) ? candidates : [];
  const valid = added.filter(item => item?.date && item?.title);
  const existingKeys = new Set(current.map(item => [item?.date, String(item?.title || '').toLowerCase()].join('|')));
  const fresh = valid.filter(item => {
    const key = [item.date, String(item.title || '').toLowerCase()].join('|');
    return !existingKeys.has(key);
  });
  return {
    items: [...current, ...fresh],
    added: fresh
  };
}

export function createAgendaImportItem({ index = 0, student, date, type = 'other', title = 'Agenda-afspraak', meta = '', source = '', createdAt } = {}) {
  return {
    id: 'agenda_' + Date.now() + '_' + index,
    student,
    date: date || '',
    type: type || 'other',
    title: String(title || '').trim() || 'Agenda-afspraak',
    meta: meta || '',
    source: source || '',
    createdAt: createdAt || new Date().toISOString()
  };
}
