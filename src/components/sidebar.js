import { normalizeKey, escapeHtml } from '../utils/text.js';

export function createSidebarView({
  isParentLoggedIn,
  isCreator,
  currentStudent,
  currentSubject,
  visibleLessons = [],
  groupLessonsBySubject,
  subjectIcon,
  actions = {}
} = {}) {
  const groups = typeof groupLessonsBySubject === 'function'
    ? groupLessonsBySubject(visibleLessons).sort((a, b) => a.label.localeCompare(b.label, 'nl'))
    : [];

  const studentSidebar = `
    <aside class="sidebar">
      <div class="student-sidebar-greeting">${currentStudent ? `Hoi ${escapeHtml(currentStudent)}! 🐶` : ''}</div>
      <button class="side-item" data-action="home"><span class="side-icon">🏠</span>Home</button>
      <button class="side-item" data-action="subjects"><span class="side-icon">📖</span>Mijn lessen</button>
      <div class="sidebar-subjects">
        ${groups.map(group => {
          const subject = group.label;
          const active = normalizeKey(currentSubject) === group.key ? ' active' : '';
          return `<button class="sidebar-subject${active}" data-action="subject" data-subject="${escapeHtml(subject)}"><span>${typeof subjectIcon === 'function' ? subjectIcon(subject) : '📚'}</span>${escapeHtml(subject)}</button>`;
        }).join('')}
      </div>
      <button class="side-item" data-action="agenda"><span class="side-icon">📅</span>Mijn agenda</button>
      <div class="sidebar-subjects agenda-subjects">
        <button class="sidebar-subject" data-action="agenda-import"><span>📥</span>Agenda invoeren</button>
        <button class="sidebar-subject sidebar-print-month" data-action="print-calendar"><span>📅</span>Maandkalender</button>
      </div>
      <button class="side-item" data-action="test-history"><span class="side-icon">📝</span>Toetsgeschiedenis</button>
      <button class="side-item sidebar-manage-left${isParentLoggedIn ? '' : ' hidden'}" data-action="manage"><span class="side-icon">⚙️</span>Beheer</button>
      <div class="sidebar-note">🐾 <strong>Goed bezig!</strong><br>Elke les brengt je een pootje verder.</div>
    </aside>`;

  const creator = !!isCreator;
  const parentSidebar = `
    <aside class="sidebar parent-sidebar">
      <div class="parent-sidebar-title">⚙️ Beheer</div>
      <button class="parent-sidebar-mainpage" data-action="main-page">🏠 Main Page</button>
      <div class="parent-sidebar-actions">
        <button class="parent-sidebar-action" data-action="create-lesson">➕ Les maken</button>
        <button class="parent-sidebar-action" data-action="test-history">📝 Toetsgeschiedenis</button>
        <button class="parent-sidebar-action" data-action="agenda-import">📥 Agenda importeren</button>
        <button class="parent-sidebar-action" data-action="archive">🗄️ Archief</button>
        <button class="parent-sidebar-action" data-action="trash">🗑️ Prullenbak</button>
        <button class="parent-sidebar-action parent-feedback-button" data-action="feedback">💬 Feedback & ideeën</button>
        ${creator ? '<button class="parent-sidebar-action parent-feedback-button" data-action="creator-console">🧠 Creator Console</button>' : ''}
      </div>
      <div class="sidebar-note">🐾 <strong>PacoGO Beheer</strong><br>${creator ? 'Hoofdbeheerder' : 'Ouder'}omgeving.</div>
    </aside>`;

  const root = document.createElement('div');
  root.className = 'pacogo-sidebar-component';
  root.innerHTML = isParentLoggedIn ? parentSidebar : studentSidebar;

  root.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const subject = button.dataset.subject;
      const handler = actions[action];
      if (typeof handler === 'function') handler(subject);
    });
  });

  return root;
}
