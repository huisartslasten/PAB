import { getStudentSubjects, getLessonsForSubject, lessonCountForSubject } from './presentation.js';

export function buildLessonSubjectViewModel(lessons = [], student) {
  const subjects = getStudentSubjects(lessons, student);
  return subjects.map(subject => ({
    subject,
    lessons: getLessonsForSubject(lessons, student, subject),
    count: lessonCountForSubject(lessons, student, subject)
  }));
}
