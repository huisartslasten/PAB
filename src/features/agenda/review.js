export function normalizeAgendaReviewCandidate(candidate = {}, index = 0, { student, source = '', now = new Date().toISOString() } = {}) {
  return {
    id: candidate.id || `agenda_${Date.now()}_${index}`,
    student: student || candidate.student || '',
    date: String(candidate.date || '').trim(),
    type: String(candidate.type || 'other').trim() || 'other',
    title: String(candidate.title || 'Agenda-afspraak').trim() || 'Agenda-afspraak',
    meta: String(candidate.meta || '').trim(),
    source: candidate.source || source || '',
    createdAt: candidate.createdAt || now
  };
}

export function prepareAgendaReviewCandidates(candidates = [], options = {}) {
  return (Array.isArray(candidates) ? candidates : [])
    .map((candidate, index) => normalizeAgendaReviewCandidate(candidate, index, options));
}

export function validateAgendaReviewItems(items = []) {
  const valid = (Array.isArray(items) ? items : [])
    .filter(item => item?.date && item?.title);
  return {
    valid: valid.length > 0,
    items: valid
  };
}

export function commitAgendaReview(existing = [], reviewed = []) {
  const current = Array.isArray(existing) ? [...existing] : [];
  const candidates = Array.isArray(reviewed) ? reviewed : [];
  const existingKeys = new Set(
    current.map(item => [item?.date, String(item?.title || '').toLowerCase()].join('|'))
  );
  const fresh = candidates.filter(item => {
    if (!item?.date || !item?.title) return false;
    const key = [item.date, String(item.title).toLowerCase()].join('|');
    return !existingKeys.has(key);
  });
  return { items: [...current, ...fresh], added: fresh };
}
