export function createLessonContextField(lesson, { documentRef = document } = {}) {
  if (!lesson) throw new Error('createLessonContextField requires a lesson.');

  const field = documentRef.createElement('section');
  field.className = 'lesson-context-field';

  const title = documentRef.createElement('h2');
  title.className = 'lesson-context-title';
  title.textContent = String(lesson.title || 'Naamloze les');

  const meta = documentRef.createElement('p');
  meta.className = 'lesson-context-meta';
  meta.textContent = `${lesson.subject || 'Les'}${lesson.subvak ? ` · ${lesson.subvak}` : ''}`;

  const header = documentRef.createElement('div');
  header.className = 'lesson-context-header';
  header.append(title, meta);
  field.append(header);

  return field;
}
