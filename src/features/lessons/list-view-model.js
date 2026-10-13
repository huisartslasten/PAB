import { getActiveStudentLessons } from './visibility.js';

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
  muziek: '🎵',
  overig: '🧩'
});

export function normalizeLessonSubject(value) {
  return String(value || '').trim().toLocaleLowerCase('nl-NL').replace(/\s+/g, ' ');
}

export function getLessonSubjectIcon(subject) {
  const key = normalizeLessonSubject(subject).replaceAll(' ', '');
  return SUBJECT_ICONS[key] || '📘';
}

export function getLessonSubjectGroups(lessons = [], student) {
  const active = getActiveStudentLessons(lessons, student);
  const groups = new Map();

  active.forEach(lesson => {
    const key = normalizeLessonSubject(lesson.subject) || 'overig';
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
