function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function groupByStudentAndSubject(lessons = []) {
  const students = new Map();
  lessons.forEach(lesson => {
    const student = String(lesson.student || 'Onbekende leerling').trim() || 'Onbekende leerling';
    const subject = String(lesson.subject || 'Overig').trim() || 'Overig';
    if (!students.has(student)) students.set(student, new Map());
    const subjects = students.get(student);
    if (!subjects.has(subject)) subjects.set(subject, []);
    subjects.get(subject).push(lesson);
  });
  return [...students.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'nl'))
    .map(([student, subjects]) => ({
      student,
      subjects: [...subjects.entries()]
        .sort(([a], [b]) => a.localeCompare(b, 'nl'))
        .map(([subject, items]) => ({ subject, items }))
    }));
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

export function renderRecovery(container, management, mode, onRestore = async () => {}) {
  if (!container) throw new Error('renderRecovery requires a container.');
  if (!management) throw new Error('renderRecovery requires management.');
  if (mode !== 'archive' && mode !== 'trash') throw new Error('renderRecovery requires a valid mode.');

  const lessons = management.getRecoveryLessons(mode);
  if (!lessons.length) {
    container.innerHTML = `<div class="management-state">${mode === 'archive' ? 'Het archief is leeg.' : 'De prullenbak is leeg.'}</div>`;
    return [];
  }

  const groups = groupByStudentAndSubject(lessons);
  container.innerHTML = groups.map(group => `
    <section class="management-recovery-student">
      <h3>${escapeHtml(group.student)}</h3>
      ${group.subjects.map(subject => `
        <section class="management-recovery-subject">
          <h4>${escapeHtml(subject.subject)}</h4>
          <div class="management-recovery-lessons">
            ${subject.items.map(lesson => `
              <article class="management-lesson" data-recovery-lesson-id="${escapeHtml(lesson.id)}">
                <h3>${escapeHtml(lesson.title)}</h3>
                <p>${escapeHtml(lesson.subject)}${lesson.subvak ? ` · ${escapeHtml(lesson.subvak)}` : ''}</p>
                <button type="button" class="management-link management-restore" data-lesson-id="${escapeHtml(lesson.id)}">↩️ Herstellen</button>
              </article>
            `).join('')}
          </div>
        </section>
      `).join('')}
    </section>
  `).join('');

  container.querySelectorAll('.management-restore').forEach(button => {
    button.addEventListener('click', async () => {
      const lesson = lessons.find(item => String(item.id) === String(button.dataset.lessonId));
      if (!lesson) return;
      button.disabled = true;
      try {
        management.selectStudent(lesson.student);
        await management.restoreLesson(lesson.id);
        await onRestore(lesson);
      } finally {
        button.disabled = false;
      }
    });
  });

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
