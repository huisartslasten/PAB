import { normalizeKey } from '../../utils/text.js';

export function normalizeAgendaText(value) { return String(value || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(); }
export function agendaSubjectKey(value) { return normalizeKey(value || ''); }
export function findAgendaLessonMatch(lessons = [], subject = '') { const key = agendaSubjectKey(subject); if (!key) return null; return lessons.find(lesson => agendaSubjectKey(lesson?.subject) === key) || null; }
export function daysUntilAgendaDate(date, today = new Date()) { if (!date) return null; const target = new Date(`${date}T00:00:00`); const base = new Date(today); if (Number.isNaN(target.getTime()) || Number.isNaN(base.getTime())) return null; target.setHours(0,0,0,0); base.setHours(0,0,0,0); return Math.round((target-base)/86400000); }
