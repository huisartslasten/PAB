export function groupLessonsBySubject(lessons = []) {
  const groups = new Map();
  for (const lesson of Array.isArray(lessons) ? lessons : []) {
    const subject = String(lesson?.subject || '').trim();
    if (!subject) continue;
    const key = subject.toLocaleLowerCase();
    if (!groups.has(key)) groups.set(key, { subject, lessons: [] });
    groups.get(key).lessons.push(lesson);
  }
  return [...groups.values()];
}

export function lessonsForSubject(lessons = [], subject = '') {
  const wanted = String(subject || '').trim().toLocaleLowerCase();
  return (Array.isArray(lessons) ? lessons : []).filter(
    lesson => String(lesson?.subject || '').trim().toLocaleLowerCase() === wanted
  );
}
