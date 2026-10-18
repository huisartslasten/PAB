import {
  getLessonSubvakGroups,
  normalizeLessonSubvak
} from '../lessons/list-view-model.js';
import { attachLessonDragSorting } from '../lessons/lesson-drag-sort.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function groupByStudentAndSubject(lessons = [], students = []) {
  const studentGroups = new Map();
  students.forEach(student => {
    const name = String(student ?? '').trim();
    if (name) studentGroups.set(name, new Map());
  });
  lessons.forEach(lesson => {
    const student = String(lesson.student || 'Onbekende leerling').trim() || 'Onbekende leerling';
    const subject = String(lesson.subject || 'Overig').trim() || 'Overig';
    if (!studentGroups.has(student)) studentGroups.set(student, new Map());
    const subjects = studentGroups.get(student);
    if (!subjects.has(subject)) subjects.set(subject, []);
    subjects.get(subject).push(lesson);
  });
  return [...studentGroups.entries()].sort(([a], [b]) => a.localeCompare(b, 'nl')).map(([student, subjects]) => ({
    student,
    subjects: [...subjects.entries()].sort(([a], [b]) => a.localeCompare(b, 'nl')).map(([subject, items]) => ({ subject, items }))
  }));
}

export function renderStudentSelection(container, management, onSelect = () => {}) {
  if (!container) throw new Error('renderStudentSelection requires a container.');
  if (!management) throw new Error('renderStudentSelection requires management.');
  const students = management.getStudents();
  container.innerHTML = students.map(student => `
    <button type="button" class="management-student" data-student="${escapeHtml(student)}">${escapeHtml(student)}</button>
  `).join('');
  container.querySelectorAll('[data-student]').forEach(button => button.addEventListener('click', () => onSelect(button.dataset.student)));
  return students;
}

export async function renderStudentLessons(container, management, { onEdit = null, onLearning = null, onArchive = null, onDelete = null } = {}) {
  if (!container) throw new Error('renderStudentLessons requires a container.');
  if (!management) throw new Error('renderStudentLessons requires management.');
  const groups = await management.getOrderedScopedLessons();
  container.innerHTML = groups.map(group => `
    <section class="management-subject" data-management-subject="${escapeHtml(group.subject)}">
      <div class="management-subject-heading"><h3>${escapeHtml(group.subject)}</h3><span>Sleep de lessen om te ordenen</span></div>
      ${getLessonSubvakGroups(group.lessons).map(subvak => `
        <section class="management-subvak" data-subvak-label="${escapeHtml(subvak.label)}">
          <h4>${subvak.key === '__geen_subvak__' ? '📚 ' : '📁 '}${escapeHtml(subvak.label)}</h4>
          <div class="management-lessons-grid">
            ${subvak.lessons.map(lesson => `
              <article class="management-lesson paco-lesson-card" draggable="true" data-lesson-id="${escapeHtml(lesson.id)}">
                <div class="management-lesson-main"><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.subject)}${lesson.subvak ? ` · ${escapeHtml(lesson.subvak)}` : ''}</p></div>
                <div class="management-links">
                  ${typeof onEdit === 'function' ? `<button type="button" class="management-link" data-edit-lesson-id="${escapeHtml(lesson.id)}">✏️ Bewerken</button>` : ''}
                  ${typeof onLearning === 'function' ? `<button type="button" class="management-link" data-learning-lesson-id="${escapeHtml(lesson.id)}">📚 Leerstof</button>` : ''}
                  ${typeof onArchive === 'function' ? `<button type="button" class="management-link" data-archive-lesson-id="${escapeHtml(lesson.id)}">🗄️ Archiveren</button>` : ''}
                  ${typeof onDelete === 'function' ? `<button type="button" class="management-link danger" data-delete-lesson-id="${escapeHtml(lesson.id)}">🗑️ Verwijderen</button>` : ''}
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      `).join('')}
    </section>
  `).join('') || '<div class="management-state">Nog geen actieve lessen.</div>';

  container.querySelectorAll('[data-edit-lesson-id]').forEach(button => button.addEventListener('click', () => {
    const lesson = management.getScopedLessons().find(item => String(item.id) === String(button.dataset.editLessonId));
    if (lesson && typeof onEdit === 'function') onEdit(lesson);
  }));
  container.querySelectorAll('[data-learning-lesson-id]').forEach(button => button.addEventListener('click', () => {
    const lesson = management.getScopedLessons().find(item => String(item.id) === String(button.dataset.learningLessonId));
    if (lesson && typeof onLearning === 'function') onLearning(lesson);
  }));
  container.querySelectorAll('[data-archive-lesson-id]').forEach(button => button.addEventListener('click', async () => {
    if (typeof onArchive !== 'function') return;
    const lesson = management.getScopedLessons().find(item => String(item.id) === String(button.dataset.archiveLessonId));
    if (!lesson) return;
    button.disabled = true;
    try { await onArchive(lesson); } finally { button.disabled = false; }
  }));
  container.querySelectorAll('[data-delete-lesson-id]').forEach(button => button.addEventListener('click', async () => {
    if (typeof onDelete !== 'function') return;
    const lesson = management.getScopedLessons().find(item => String(item.id) === String(button.dataset.deleteLessonId));
    if (!lesson) return;
    button.disabled = true;
    try { await onDelete(lesson); } finally { button.disabled = false; }
  }));

  attachLessonDragSorting(container, {
    selector: '.management-lesson[data-lesson-id][draggable="true"]',
    onOrderChange: async ({ sourceId, target }) => {
      const sourceLesson = management.getScopedLessons().find(item => Number(item.id) === sourceId);
      const subjectBlock = target.closest('.management-subject');
      const subject = subjectBlock?.dataset.managementSubject;
      if (!subject) throw new Error('Lesson subject could not be determined.');
      const targetSubvak = target.closest('.management-subvak')?.dataset.subvakLabel || 'Zonder subvak';
      const newSubvak = targetSubvak === 'Zonder subvak' ? '' : targetSubvak;
      if (normalizeLessonSubvak(sourceLesson?.subvak) !== normalizeLessonSubvak(newSubvak)) await management.moveLessonToSubvak(sourceId, newSubvak);
      await persistSubjectOrder(container, management, subject);
    },
    onError: async error => {
      console.error('Management lesson reorder error:', error);
      await renderStudentLessons(container, management, { onEdit, onLearning, onArchive, onDelete });
    }
  });

  container.querySelectorAll('.management-subvak').forEach(block => {
    block.addEventListener('dragover', event => {
      if (event.target.closest('.management-lesson')) return;
      event.preventDefault(); event.dataTransfer.dropEffect = 'move'; block.classList.add('drop-active');
    });
    block.addEventListener('dragleave', event => { if (!block.contains(event.relatedTarget)) block.classList.remove('drop-active'); });
    block.addEventListener('drop', async event => {
      if (event.target.closest('.management-lesson')) return;
      event.preventDefault();
      const sourceId = Number(event.dataTransfer.getData('text/plain'));
      const source = container.querySelector(`[data-lesson-id="${sourceId}"]`);
      const subjectBlock = block.closest('.management-subject');
      const subject = subjectBlock?.dataset.managementSubject;
      if (!source || !subject) return;
      try {
        const label = block.dataset.subvakLabel || 'Zonder subvak';
        await management.moveLessonToSubvak(sourceId, label === 'Zonder subvak' ? '' : label);
        block.querySelector('.management-lessons-grid').appendChild(source);
        await persistSubjectOrder(container, management, subject);
        await renderStudentLessons(container, management, { onEdit, onLearning, onArchive, onDelete });
      } catch (error) {
        console.error('Management lesson subvak move error:', error);
        await renderStudentLessons(container, management, { onEdit, onLearning, onArchive, onDelete });
      }
    });
  });
  return groups;
}

async function persistSubjectOrder(container, management, subject) {
  const subjectSelector = `[data-management-subject="${CSS.escape(subject)}"]`;
  const ids = [...container.querySelectorAll(`${subjectSelector} .management-lesson[data-lesson-id]`)].map(card => Number(card.dataset.lessonId)).filter(Boolean);
  const current = management.getScopedLessons();
  const lessons = ids.map(id => current.find(lesson => Number(lesson.id) === id)).filter(Boolean);
  await management.saveLessonOrder(subject, lessons);
}

export function renderRecovery(container, management, mode, onRestore = async () => {}, onEmptyTrash = async () => {}, onPermanentDelete = async () => {}, onError = async () => {}) {
  if (!container) throw new Error('renderRecovery requires a container.');
  if (!management) throw new Error('renderRecovery requires management.');
  if (mode !== 'archive' && mode !== 'trash') throw new Error('renderRecovery requires a valid mode.');
  const lessons = management.getRecoveryLessons(mode);
  const students = management.getStudents();
  const emptyTrashButton = mode === 'trash' && lessons.length && typeof onEmptyTrash === 'function' ? `<div class="management-links"><button type="button" class="management-link danger" data-empty-trash>🗑️ Prullenbak definitief leegmaken</button></div>` : '';
  const groups = groupByStudentAndSubject(lessons, students);
  container.innerHTML = `${emptyTrashButton}${groups.map(group => `
    <section class="management-recovery-student"><h3>${escapeHtml(group.student)}</h3>
      ${group.subjects.length ? group.subjects.map(subject => `
        <section class="management-recovery-subject"><h4>${escapeHtml(subject.subject)}</h4><div class="management-recovery-lessons">
          ${subject.items.map(lesson => `
            <article class="management-lesson paco-lesson-card" data-recovery-lesson-id="${escapeHtml(lesson.id)}">
              <h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.subject)}${lesson.subvak ? ` · ${escapeHtml(lesson.subvak)}` : ''}</p>
              <div class="management-links"><button type="button" class="management-link management-restore" data-lesson-id="${escapeHtml(lesson.id)}">↩️ Herstellen</button>
                ${mode === 'trash' && typeof onPermanentDelete === 'function' ? `<button type="button" class="management-link danger management-permanent-delete" data-permanent-delete-lesson-id="${escapeHtml(lesson.id)}">🗑️ Definitief verwijderen</button>` : ''}
              </div>
            </article>`).join('')}
        </div></section>`).join('') : `<div class="management-state">${mode === 'archive' ? 'Geen gearchiveerde lessen.' : 'Geen lessen in de prullenbak.'}</div>`}
    </section>`).join('')}`;
  const emptyButton = container.querySelector('[data-empty-trash]');
  emptyButton?.addEventListener('click', async () => { emptyButton.disabled = true; try { await onEmptyTrash(); } catch (error) { await onError(error); } finally { emptyButton.disabled = false; } });
  container.querySelectorAll('.management-restore').forEach(button => button.addEventListener('click', async () => {
    const lesson = lessons.find(item => String(item.id) === String(button.dataset.lessonId)); if (!lesson) return; button.disabled = true;
    try { await management.restoreLesson(lesson.id); await onRestore(lesson); } catch (error) { await onError(error); } finally { button.disabled = false; }
  }));
  container.querySelectorAll('.management-permanent-delete').forEach(button => button.addEventListener('click', async () => {
    const lesson = lessons.find(item => String(item.id) === String(button.dataset.permanentDeleteLessonId)); if (!lesson) return; button.disabled = true;
    try { await onPermanentDelete(lesson); } catch (error) { await onError(error); } finally { button.disabled = false; }
  }));
  return lessons;
}

export async function renderFeedback(container, management) {
  if (!container) throw new Error('renderFeedback requires a container.');
  if (!management) throw new Error('renderFeedback requires management.');
  const feedback = await management.listFeedback();
  const labels = { idea: '💡 Idee / wens', bug: '🐛 Foutmelding', improvement: '🔧 Verbetering', other: '❓ Anders' };
