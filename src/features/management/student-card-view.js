import { buildAgendaViewModel } from '../agenda/agenda-view-model.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toDateKey(value) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return next;
}

function formatAgendaDate(value) {
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return String(value || '');
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' }).format(date);
}

export function buildStudentManagementCardModel({
  students = [],
  lessons = [],
  getAgendaItems = () => [],
  today = new Date(),
  horizonDays = 6
} = {}) {
  const endKey = toDateKey(addDays(today, horizonDays));
  const allLessons = Array.isArray(lessons) ? lessons : [];

  return (Array.isArray(students) ? students : []).map(student => {
    const studentLessons = allLessons.filter(lesson => String(lesson?.student || '').trim() === String(student).trim());
    const subjects = [...new Set(studentLessons
      .map(lesson => String(lesson?.subject || '').trim())
      .filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'nl'));

    const agendaItems = buildAgendaViewModel(getAgendaItems(student), { student, today })
      .upcoming
      .filter(item => String(item.date).slice(0, 10) <= endKey)
      .sort((a, b) => `${a.date}|${a.title || ''}`.localeCompare(`${b.date}|${a.title || ''}`, 'nl'));

    return {
      student,
      subjects,
      agendaItems,
      hasAgenda: agendaItems.length > 0
    };
  });
}

export function renderStudentManagementCards(container, {
  students = [],
  lessons = [],
  getAgendaItems = () => [],
  onSelect = () => {},
  onCreateLesson = () => {},
  onOpenAgenda = () => {},
  onOpenLessons = () => {},
  onOpenMonthCalendar = () => {},
  onOpenStudent = () => {},
  today = new Date()
} = {}) {
  if (!container) throw new Error('renderStudentManagementCards requires a container.');

  const cards = buildStudentManagementCardModel({ students, lessons, getAgendaItems, today });
  container.innerHTML = cards.map(card => `
    <article class="management-student-card" data-student-card="${escapeHtml(card.student)}">
      <div class="management-student-card-top">
        <button type="button" class="management-student-name" data-select-student="${escapeHtml(card.student)}">👦 ${escapeHtml(card.student)}</button>
        <button type="button" class="management-student-open" data-open-student="${escapeHtml(card.student)}">→ Naar leerling</button>
      </div>

      <div class="management-student-actions">
        <button type="button" class="management-student-action" data-create-lesson="${escapeHtml(card.student)}">➕ Les maken</button>
      </div>

      <button type="button" class="management-student-section management-student-section-link" data-open-lessons="${escapeHtml(card.student)}">
        <span class="management-student-section-label">📚 VAKKEN</span>
        <span class="management-subject-chips">
          ${card.subjects.length ? card.subjects.map(subject => `<span class="management-subject-chip">${escapeHtml(subject)}</span>`).join('') : '<span class="management-student-muted">Geen actieve lessen.</span>'}
        </span>
      </button>

      <div class="management-student-section management-student-agenda">
        <div class="management-student-agenda-head">
          <button type="button" class="management-student-agenda-link" data-open-agenda="${escapeHtml(card.student)}">
            <span class="management-student-section-label">📅 KOMENDE WEEK</span>
            ${card.hasAgenda ? `<span class="management-agenda-preview">${card.agendaItems.map(item => `
              <span class="management-agenda-preview-item">
                <span class="management-agenda-date">${escapeHtml(formatAgendaDate(item.date))}</span>
                <span class="management-agenda-title">${escapeHtml(item.title || 'Agenda-item')}</span>
              </span>`).join('')}</span>` : '<span class="management-student-muted">Geen komende agenda-items.</span>'}
          </button>
          <button type="button" class="management-student-action management-student-calendar-action" data-open-calendar="${escapeHtml(card.student)}">🖨️ Maandkalender</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('[data-select-student]').forEach(button => {
    button.addEventListener('click', () => onSelect(button.dataset.selectStudent));
  });
  container.querySelectorAll('[data-create-lesson]').forEach(button => {
    button.addEventListener('click', () => onCreateLesson(button.dataset.createLesson));
  });
  container.querySelectorAll('[data-open-agenda]').forEach(button => {
    button.addEventListener('click', () => onOpenAgenda(button.dataset.openAgenda));
  });
  container.querySelectorAll('[data-open-lessons]').forEach(button => {
    button.addEventListener('click', () => onOpenLessons(button.dataset.openLessons));
  });
  container.querySelectorAll('[data-open-calendar]').forEach(button => {
    button.addEventListener('click', () => onOpenMonthCalendar(button.dataset.openCalendar));
  });
  container.querySelectorAll('[data-open-student]').forEach(button => {
    button.addEventListener('click', () => onOpenStudent(button.dataset.openStudent));
  });

  return cards;
}
