import { normalizeAgendaText } from './agenda-domain.js';

export function normalizeAgendaDate(value) {
  return String(value || '').trim().slice(0, 10);
}

export function agendaTitleWords(value) {
  return normalizeAgendaText(value)
    .split(/\s+/)
    .map(word => word.trim())
    .filter(Boolean);
}

export function agendaTitleSimilarity(a, b) {
  const left = normalizeAgendaText(a);
  const right = normalizeAgendaText(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.94;
  const leftWords = new Set(agendaTitleWords(left));
  const rightWords = new Set(agendaTitleWords(right));
  const intersection = [...leftWords].filter(word => rightWords.has(word)).length;
  const shorter = Math.min(leftWords.size, rightWords.size);
  return shorter ? intersection / shorter : 0;
}

export function agendaEventsAreDuplicate(a = {}, b = {}) {
  if (normalizeAgendaDate(a.date) !== normalizeAgendaDate(b.date)) return false;
  const titleScore = agendaTitleSimilarity(a.title, b.title);
  if (titleScore >= 0.9) return true;
  const timeA = String(a.time || '').trim();
  const timeB = String(b.time || '').trim();
  return Boolean(timeA && timeB && timeA === timeB && titleScore >= 0.6);
}

export function mergeAgendaAiEvents(existing = [], candidates = []) {
  const merged = Array.isArray(existing) ? [...existing] : [];
  for (const candidate of Array.isArray(candidates) ? candidates : []) {
    if (!candidate?.date || !candidate?.title) continue;
    if (merged.some(item => agendaEventsAreDuplicate(item, candidate))) continue;
    merged.push({ ...candidate, meta: candidate.meta || '', source: candidate.source || 'AI agenda-import' });
  }
  return merged.slice(0, 30);
}
