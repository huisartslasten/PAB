import { agendaEventsAreDuplicate, normalizeAgendaDate } from './merge.js';

export function normalizeAgendaReviewCandidate(candidate = {}, index = 0, { student, source = '', now = new Date().toISOString() } = {}) {
  return {
    id: candidate.id || `agenda_${Date.now()}_${index}`,
    student: student || candidate.student || '',
    date: normalizeAgendaDate(candidate.date),
    type: String(candidate.type || 'other').trim() || 'other',
    title: String(candidate.title || 'Agenda-afspraak').trim() || 'Agenda-afspraak',
    meta: String(candidate.meta || '').trim(),
    time: String(candidate.time || candidate.start_time || '').trim(),
    source: candidate.source || source || '',
    createdAt: candidate.createdAt || now
  };
}

export function prepareAgendaReviewCandidates(candidates = [], options = {}) {
  return (Array.isArray(candidates) ? candidates : [])
    .map((candidate, index) => normalizeAgendaReviewCandidate(candidate, index, options))
    .filter(candidate => candidate.date && candidate.title);
}

export function validateAgendaReviewItems(items = []) {
  const valid = (Array.isArray(items) ? items : [])
    .filter(item => item?.date && item?.title);
  return { valid: valid.length > 0, items: valid };
}

export function commitAgendaReview(existing = [], reviewed = []) {
  const current = Array.isArray(existing) ? [...existing] : [];
  const added = [];
  for (const item of Array.isArray(reviewed) ? reviewed : []) {
    if (!item?.date || !item?.title) continue;
    if (current.some(existingItem => agendaEventsAreDuplicate(existingItem, item))) continue;
    current.push(item);
    added.push(item);
  }
  return { items: current, added };
}
