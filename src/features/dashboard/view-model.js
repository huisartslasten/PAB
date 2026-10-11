import { getActiveStudentLessons } from '../lessons/visibility.js';

const SUBJECT_ICONS = Object.freeze({
  nederlands: '📚',
  engels: '🇬🇧',
  rekenen: '🔢',
  spelling: '✏️',
  begrijpendlezen: '📖',
  topografie: '🌍',
  geschiedenis: '🏛️',
  aardrijkskunde: '🗺️',
  natuur: '🌱',
  biologie: '🧬',
  muziek: '🎵'
});

function normalizeSubject(value) {
  return String(value || '').trim().toLocaleLowerCase('nl-NL').replace(/\s+/g, ' ');
}

export function getDashboardSubjectIcon(subject) {
  return SUBJECT_ICONS[normalizeSubject(subject).replaceAll(' ', '')] || '📘';
}

export function getDashboardSubjects(lessons = [], student) {
  const active = getActiveStudentLessons(lessons, student);
  const groups = new Map();

  active.forEach(lesson => {
    const key = normalizeSubject(lesson.subject) || 'overig';
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: String(lesson.subject || 'Overig').trim() || 'Overig',
        lessons: []
      });
    }
    groups.get(key).lessons.push(lesson);
  });

  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label, 'nl'));
}

export function getDashboardProgress(lessons = [], student, masteryService) {
  const active = getActiveStudentLessons(lessons, student);
  const items = active.flatMap(lesson =>
    (Array.isArray(lesson.lesson_items) ? lesson.lesson_items : []).map(item => ({
      lessonId: lesson.id,
      itemId: item.id
    }))
  );

  const mastered = masteryService
    ? items.filter(item => masteryService.get(student, item.lessonId, item.itemId).mastered).length
    : 0;

  return Object.freeze({
    lessons: active.length,
    subjects: getDashboardSubjects(active, student).length,
    items: items.length,
    mastered,
    percent: items.length ? Math.round(mastered / items.length * 100) : 0
  });
}

export function getDashboardAgendaItems(agendaRead, limit = 4, today = new Date()) {
  if (!agendaRead || typeof agendaRead.buildAgendaItemsForRender !== 'function') return [];

  const todayKey = today.toISOString().slice(0, 10);
  const items = agendaRead.buildAgendaItemsForRender()
    .filter(item => String(item?.date || '') >= todayKey)
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));

  return items.slice(0, Math.max(0, Number(limit) || 0)).map(item => Object.freeze({
    id: item.id,
    date: item.date,
    type: item.type || 'other',
    icon: item.icon || '📌',
    title: String(item.title || 'Agenda-item'),
    meta: String(item.meta || ''),
    lessonId: item.lessonId ?? null
  }));
}
