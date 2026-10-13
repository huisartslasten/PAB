function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeSubvak(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('nl-NL');
}

function subvakLabel(value) {
  const clean = String(value ?? '').trim().replace(/\s+/g, ' ');
  return clean || 'Zonder subvak';
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

function groupBySubvak(lessons = []) {
  const groups = new Map();
  lessons.forEach(lesson => {
    const key = normalizeSubvak(lesson.subvak) || '__geen_subvak__';
    if (!groups.has(key)) groups.set(key, { key, label: subvakLabel(lesson.subvak), lessons: [] });
    groups.get(key).lessons.push(lesson);
  });
  return [...groups.values()];
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

function clearDragState(container) {
  container.querySelectorAll('.management-lesson.dragging,.management-lesson.drag-over,.management-subvak.drop-active')
    .forEach(element => element.classList.remove('dragging', 'drag-over', 'drop-active'));
}

async function persistSubjectOrder(container, management, subject) {
  const ids = [...container.querySelectorAll(`[data-management-subject="${CSS.escape(subject)}"] .management-lesson[data-lesson-id]`)]
    .map(card => Number(card.dataset.lessonId))
    .filter(Boolean);
  const current = management.getScopedLessons();
  const lessons = ids.map(id => current.find(lesson => Number(lesson.id) === id)).filter(Boolean);
  await management.saveLessonOrder(subject, lessons);
}

export async function renderStudentLessons(container, management, onEdit = null) {
  if (!container) throw new Error('renderStudentLessons requires a container.');
  if (!management) throw new Error('renderStudentLessons requires management.');

  const groups = await management.getOrderedScopedLessons();
  container.innerHTML = groups.map(group => `
    <section class="management-subject" data-management-subject="${escapeHtml(group.subject)}">
      <div class="management-subject-heading"><h3>${escapeHtml(group.subject)}</h3><span>Sleep de lessen om te ordenen</span></div>
      ${groupBySubvak(group.lessons).map(subvak => `
        <section class="management-subvak" data-subvak-label="${escapeHtml(subvak.label)}">
          <h4>${subvak.key === '__geen_subvak__' ? '📚 ' : '📁 '}${escapeHtml(subvak.label)}</h4>
          <div class="management-lessons-grid">
            ${subvak.lessons.map(lesson => `
              <article class="management-lesson" draggable="true" data-lesson-id="${escapeHtml(lesson.id)}">
                <div class="management-lesson-main">
                  <h3>${escapeHtml(lesson.title)}</h3>
                  <p>${escapeHtml(lesson.subject)}${lesson.subvak ? ` · ${escapeHtml(lesson.subvak)}` : ''}</p>
                </div>
                ${typeof onEdit === 'function' ? `<div class="management-links"><button type="button" class="management-link" data-edit-lesson-id="${escapeHtml(lesson.id)}">✏️ Bewerken</button></div>` : ''}
              </article>
            `).join('')}
          </div>
        </section>
      `).join('')}
    </section>
  `).join('') || '<div class="management-state">Nog geen actieve lessen.</div>';

  container.querySelectorAll('[data-edit-lesson-id]').forEach(button => {
    button.addEventListener('click', () => {
      const lesson = management.getScopedLessons().find(item => String(item.id) === String(button.dataset.editLessonId));
      if (lesson && typeof onEdit === 'function') onEdit(lesson);
    });
  });

  container.querySelectorAll('.management-lesson').forEach(card => {
    card.addEventListener('dragstart', event => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.dataset.lessonId);
      card.classList.add('dragging');
    });
    card.addEventListener('dragover', event => {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move';
      if (!card.classList.contains('dragging')) card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', async event => {
      event.preventDefault();
      event.stopPropagation();
      const sourceId = Number(event.dataTransfer.getData('text/plain'));
      const targetId = Number(card.dataset.lessonId);
      if (!sourceId || !targetId || sourceId === targetId) {
        clearDragState(container);
        return;
      }
      const source = container.querySelector(`[data-lesson-id="${sourceId}"]`);
      const target = card;
      const subjectBlock = target.closest('.management-subject');
      const subject = subjectBlock?.dataset.managementSubject;
      if (!source || !subject) {
        clearDragState(container);
        return;
      }
      try {
        const sourceLesson = management.getScopedLessons().find(item => Number(item.id) === sourceId);
        const targetSubvak = target.closest('.management-subvak')?.dataset.subvakLabel || 'Zonder subvak';
        const sourceSubvak = source.closest('.management-subvak')?.dataset.subvakLabel || 'Zonder subvak';
        const newSubvak = targetSubvak === 'Zonder subvak' ? '' : targetSubvak;
        if (normalizeSubvak(sourceLesson?.subvak) !== normalizeSubvak(newSubvak)) {
          await management.moveLessonToSubvak(sourceId, newSubvak);
        }
        const rect = target.getBoundingClientRect();
        if (event.clientY > rect.top + rect.height / 2) target.after(source);
        else target.before(source);
        await persistSubjectOrder(container, management, subject);
        await renderStudentLessons(container, management, onEdit);
      } catch (error) {
        console.error('Management lesson reorder error:', error);
        await renderStudentLessons(container, management, onEdit);
        throw error;
      } finally {
        clearDragState(container);
      }
    });
    card.addEventListener('dragend', () => clearDragState(container));
  });

  container.querySelectorAll('.management-subvak').forEach(block => {
    block.addEventListener('dragover', event => {
      if (event.target.closest('.management-lesson')) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      block.classList.add('drop-active');
    });
    block.addEventListener('dragleave', event => {
      if (block.contains(event.relatedTarget)) return;
      block.classList.remove('drop-active');
    });
    block.addEventListener('drop', async event => {
      if (event.target.closest('.management-lesson')) return;
      event.preventDefault();
      const sourceId = Number(event.dataTransfer.getData('text/plain'));
      const source = container.querySelector(`[data-lesson-id="${sourceId}"]`);
      const subjectBlock = block.closest('.management-subject');
      const subject = subjectBlock?.dataset.managementSubject;
      if (!source || !subject) {
        clearDragState(container);
        return;
      }
      try {
        const label = block.dataset.subvakLabel || 'Zonder subvak';
        await management.moveLessonToSubvak(sourceId, label === 'Zonder subvak' ? '' : label);
        block.querySelector('.management-lessons-grid').appendChild(source);
        await persistSubjectOrder(container, management, subject);
        await renderStudentLessons(container, management, onEdit);
      } catch (error) {
        console.error('Management lesson subvak move error:', error);
        await renderStudentLessons(container, management, onEdit);
        throw error;
      } finally {
        clearDragState(container);
      }
    });
  });

  return groups;
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
  const labels = { idea: '💡 Idee / wens', bug: '🐛 Foutmelding', improvement: '🔧 Verbetering', other: '❓ Anders' };

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
