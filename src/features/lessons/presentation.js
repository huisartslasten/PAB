import { getActiveStudentLessons } from './visibility.js';

const SUBJECT_CLASSES = Object.freeze({
  Nederlands: 'subject-blue', Engels: 'subject-purple', Rekenen: 'subject-green',
  Geschiedenis: 'subject-orange', Aardrijkskunde: 'subject-cyan', Biologie: 'subject-green',
  Natuur: 'subject-orange', Frans: 'subject-pink', Spaans: 'subject-purple', Muziek: 'subject-pink',
  Lezen: 'subject-blue', Topografie: 'subject-cyan', Wetenschap: 'subject-green', Techniek: 'subject-orange'
});

const SUBJECT_ICONS = Object.freeze({
  Nederlands:'📚', Engels:'🇬🇧', Rekenen:'🔢', Geschiedenis:'🏴‍☠️', Aardrijkskunde:'🌍',
  Biologie:'🧬', Natuur:'🔬', Frans:'🇫🇷', Spaans:'🇪🇸', Muziek:'🎵', Lezen:'📖',
  Topografie:'🗺️', Wetenschap:'🧪', Techniek:'⚙️'
});

export function subjectClass(subject) {
  if (SUBJECT_CLASSES[subject]) return SUBJECT_CLASSES[subject];
  const text = String(subject || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) - hash) + text.charCodeAt(i) | 0;
  const classes = ['subject-blue','subject-purple','subject-green','subject-orange','subject-pink','subject-cyan'];
  return classes[Math.abs(hash) % classes.length];
}

export function subjectIcon(subject) {
  return SUBJECT_ICONS[subject] || '🎓';
}

export function getStudentSubjects(lessons = [], student) {
  const visible = getActiveStudentLessons(lessons, student);
  return [...new Set(visible.map(lesson => lesson.subject))];
}

export function getLessonsForSubject(lessons = [], student, subject) {
  return getActiveStudentLessons(lessons, student)
    .filter(lesson => lesson.subject === subject);
}

export function lessonCountForSubject(lessons = [], student, subject) {
  return getLessonsForSubject(lessons, student, subject).length;
}
