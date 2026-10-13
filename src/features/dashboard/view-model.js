import { getLessonSubjectGroups, getLessonSubjectIcon } from '../lessons/list-view-model.js';

export function getDashboardSubjectIcon(subject) {
  return getLessonSubjectIcon(subject);
}

export function getDashboardSubjects(lessons = [], student) {
  return getLessonSubjectGroups(lessons, student);
}

export function getDashboardProgress(lessons = [], student, masteryService) {
  const subjects = getLessonSubjectGroups(lessons, student);
  const active = subjects.flatMap(subject => subject.lessons);
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
    subjects: subjects.length,
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
