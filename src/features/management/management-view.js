function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderStudentSelection(container, management, onSelect = () => {}) {
  if (!container) throw new Error('renderStudentSelection requires a container.');
  if (!management) throw new Error('renderStudentSelection requires management.');

  const students = management.getStudents();
  container.innerHTML = students.map(student => `
    <button type="button" class="management-student" data-student="${escapeHtml(student)}">
      ${escapeHtml(student)}
    </button>
  `).join('');

  container.querySelectorAll('[data-student]').forEach(button => {
    button.addEventListener('click', () => onSelect(button.dataset.student));
  });

  return students;
}

export function renderStudentLessons(container, management) {
  if (!container) throw new Error('renderStudentLessons requires a container.');
  if (!management) throw new Error('renderStudentLessons requires management.');

  const lessons = management.getScopedLessons();
  container.innerHTML = lessons.map(lesson => `
    <article class="management-lesson" data-lesson-id="${escapeHtml(lesson.id)}">
      <h3>${escapeHtml(lesson.title)}</h3>
      <p>${escapeHtml(lesson.subject)}${lesson.subvak ? ` · ${escapeHtml(lesson.subvak)}` : ''}</p>
    </article>
  `).join('');

  return lessons;
}

export async function renderFeedback(container, management) {
  if (!container) throw new Error('renderFeedback requires a container.');
  if (!management) throw new Error('renderFeedback requires management.');

  const feedback = await management.listFeedback();
  const labels = {
    idea: '💡 Idee / wens',
    bug: '🐛 Foutmelding',
    improvement: '🔧 Verbetering',
    other: '❓ Anders'
  };

  container.innerHTML = (feedback || []).map(item => `
    <article class="management-feedback" data-feedback-id="${escapeHtml(item.id)}">
      <div><strong>${escapeHtml(labels[item.feedback_type] || item.feedback_type)}</strong></div>
      <h3>${escapeHtml(item.subject)}</h3>
      <p>${escapeHtml(item.message)}</p>
      <span class="management-feedback-status">${escapeHtml(item.status || 'new')}</span>
    </article>
  `).join('');

  return feedback || [];
}
