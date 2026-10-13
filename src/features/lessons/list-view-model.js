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

const SUBJECT_LABELS = Object.freeze({
  nederlands: 'Nederlands',
  engels: 'Engels',
  rekenen: 'Rekenen',
  geschiedenis: 'Geschiedenis',
  aardrijkskunde: 'Aardrijkskunde',
  biologie: 'Biologie',
  natuur: 'Natuur',
  frans: 'Frans',
  spaans: 'Spaans',
  muziek: 'Muziek',
  lezen: 'Lezen',
  topografie: 'Topografie',
  wetenschap: 'Wetenschap',
  techniek: 'Techniek'
});

export function normalizeLessonSubject(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('nl-NL')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getLessonSubjectLabel(value) {
  const clean = String(value || '').trim().replace(/\s+/g, ' ');
  const key = normalizeLessonSubject(clean);
  return SUBJECT_LABELS[key]
    || (!clean ? 'Onbekend vak' : clean.charAt(0).toLocaleUpperCase('nl-NL') + clean.slice(1));
}

export function getLessonSubjectIcon(subject) {
  const key = normalizeLessonSubject(subject).replaceAll(' ', '');
  return SUBJECT_ICONS[key] || '📘';
}

export function normalizeLessonSubvak(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('nl-NL');
}

export function getLessonSubvakLabel(value) {
  const clean = String(value || '').trim().replace(/\s+/g, ' ');
  return clean || 'Zonder subvak';
}

export function getLessonSubvakGroups(lessons = []) {
  const groups = new Map();

  lessons.forEach(lesson => {
    const raw = String(lesson.subvak || '').trim();
    const key = normalizeLessonSubvak(raw) || '__geen_subvak__';
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: getLessonSubvakLabel(raw),
        lessons: []
      });
    }
    groups.get(key).lessons.push(lesson);
  });

  return [...groups.values()];
}

export function getLessonSubjectGroups(lessons = [], student) {
  const active = getActiveStudentLessons(lessons, student);
  const groups = new Map();

  active.forEach(lesson => {
    const key = normalizeLessonSubject(lesson.subject);
    if (!key) return;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: getLessonSubjectLabel(lesson.subject),
        lessons: []
      });
    }
    groups.get(key).lessons.push(lesson);
  });

  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label, 'nl'));
}