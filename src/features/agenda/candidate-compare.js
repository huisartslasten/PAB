import { agendaTitleSimilarity, normalizeAgendaDate } from './merge.js';

export function compareAgendaCandidates(a = {}, b = {}) {
  const sameDate = normalizeAgendaDate(a.date) === normalizeAgendaDate(b.date);
  const titleScore = agendaTitleSimilarity(a.title, b.title);
  const sameTime = Boolean(a.time && b.time && String(a.time).trim() === String(b.time).trim());

  return Object.freeze({
    sameDate,
    sameTime,
    titleScore,
    likelySame: sameDate && (titleScore >= 0.9 || (sameTime && titleScore >= 0.6))
  });
}
