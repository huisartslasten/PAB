import { normalizeAgendaText } from './agenda-domain.js';

export function normalizeAgendaDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const iso = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (iso) return iso[1] + '-' + String(iso[2]).padStart(2, '0') + '-' + String(iso[3]).padStart(2, '0');
  const ymd = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (ymd) {
    const a = Number(ymd[1]), b = Number(ymd[2]), year = ymd[3];
    if (a > 12) return year + '-' + String(b).padStart(2, '0') + '-' + String(a).padStart(2, '0');
    if (b > 12) return year + '-' + String(a).padStart(2, '0') + '-' + String(b).padStart(2, '0');
  }
  return raw.toLowerCase().replace(/\s+/g, ' ');
}

export function agendaTitleWords(value) {
  return normalizeAgendaText(value).split(/\s+/).map(word => word.trim()).filter(Boolean);
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
  const cleanTitle = value => String(value || '').replace(/^\s*toets\s*:\s*/i, '').trim();
  const titleScore = agendaTitleSimilarity(cleanTitle(a.title), cleanTitle(b.title));
  if (titleScore >= 0.9) return true;
  const timeA = String(a.time || a.start_time || '').trim();
  const timeB = String(b.time || b.start_time || '').trim();
  return Boolean(timeA && timeB && timeA === timeB && titleScore >= 0.6);
}

export function mergeAgendaAiEvents(allEvents = []) {
  const merged = [];
  for (const event of allEvents) {
    const title = String(event?.title || '').trim();
    const date = String(event?.date || '').trim();
    if (!title || !date) continue;
    const duplicate = merged.find(existing => agendaEventsAreDuplicate(existing, event));
    if (duplicate) {
      if (title.length > duplicate.title.length) duplicate.title = title;
      if (!duplicate.meta && event.meta) duplicate.meta = event.meta;
      if (!duplicate.type && event.type) duplicate.type = event.type;
      continue;
    }
    merged.push({
      date: normalizeAgendaDate(date),
      type: event.type || 'other',
      title,
      meta: event.meta || 'Gevonden door AI in Scolpanos',
      source: 'AI agenda-import'
    });
  }
  return merged.slice(0, 30);
}
