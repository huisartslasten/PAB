// PacoGO shared sidebar components.
// Extracted from the V4.78 runtime without changing the legacy DOM contract.
// This module is intentionally not wired into index.html yet; migration happens only after parity checks.

export function createSidebarComponents({
  isParentLoggedIn,
  isCreator,
  showHome = 'showHome',
  goToSubjects = 'goToSubjects',
  showAgenda = 'showAgenda',
  showAgendaImport = 'showAgendaImport',
  showPrintCalendar = 'showPrintCalendar',
  showTestHistory = 'showTestHistory',
  showParentDashboard = 'showParentDashboard',
  parentStartLesson = 'parentStartLesson',
  showArchive = 'showArchive',
  showTrash = 'showTrash',
  showParentFeedback = 'showParentFeedback',
  showCreatorConsole = 'showCreatorConsole',
  switchStudent = 'switchStudent'
} = {}) {
  const call = name => String(name || '').replace(/[^A-Za-z0-9_$]/g, '');

  function buildStudentSidebarHtml() {
    return `<aside class="sidebar"><div class="student-sidebar-greeting"></div><button class="side-item" onclick="${call(showHome)}()"><span class="side-icon">🏠</span>Home</button><button class="side-item" onclick="${call(goToSubjects)}()"><span class="side-icon">📖</span>Mijn lessen</button><div class="sidebar-subjects"></div><button class="side-item" onclick="${call(showAgenda)}()"><span class="side-icon">📅</span>Mijn agenda</button><div class="sidebar-subjects agenda-subjects"><button class="sidebar-subject" onclick="${call(showAgendaImport)}()"><span>📥</span>Agenda invoeren</button><button class="sidebar-subject sidebar-print-month" onclick="${call(showPrintCalendar)}(currentStudent)"><span>📅</span>Maandkalender</button></div><button class="side-item" onclick="isParentLoggedIn()?${call(showTestHistory)}(currentStudent):showLogin()"><span class="side-icon">📝</span>Toetsgeschiedenis</button><button class="side-item sidebar-manage-left hidden" onclick="isParentLoggedIn()?${call(showParentDashboard)}():showLogin()"><span class="side-icon">⚙️</span>Beheer</button><div class="sidebar-note">🐾 <strong>Goed bezig!</strong><br>Elke les brengt je een pootje verder.</div></aside>`;
  }

  function buildParentSidebarHtml() {
    const creator = Boolean(isCreator?.());
    return `<aside class="sidebar parent-sidebar"><div class="parent-sidebar-title">⚙️ Beheer</div><button class="parent-sidebar-mainpage" onclick="${call(switchStudent)}()">🏠 Main Page</button><div class="parent-sidebar-actions"><button class="parent-sidebar-action" onclick="${call(parentStartLesson)}()">➕ Les maken</button><button class="parent-sidebar-action" onclick="${call(showTestHistory)}()">📝 Toetsgeschiedenis</button><button class="parent-sidebar-action" onclick="${call(showAgendaImport)}()">📥 Agenda importeren</button><button class="parent-sidebar-action" onclick="${call(showArchive)}()">🗄️ Archief</button><button class="parent-sidebar-action" onclick="${call(showTrash)}()">🗑️ Prullenbak</button><button class="parent-sidebar-action parent-feedback-button" onclick="${call(showParentFeedback)}()">💬 Feedback & ideeën</button>${creator?`<button class="parent-sidebar-action parent-feedback-button" onclick="${call(showCreatorConsole)}()">🧠 Creator Console</button>`:''}</div><div class="sidebar-note">🐾 <strong>PacoGO Beheer</strong><br>${creator?'Hoofdbeheerder':'Ouder'}omgeving.</div></aside>`;
  }

  function buildRightSidebarHtml(includeManage = true) {
    return '<aside class="side-panel">' +
      (!includeManage ? '<button class="logout-button side-logout-button hidden" onclick="logoutParent()">Logout</button>' : '') +
      (includeManage ? '<button class="parent-button side-manage-button hidden" onclick="isParentLoggedIn()?showParentDashboard():showLogin()">⚙️ Beheer</button>' : '') +
      '<button class="card side-card mini-agenda-card" onclick="showAgenda()" type="button">' +
        '<div class="mini-agenda-head"><h3>📅 Mijn agenda</h3><span>Bekijk →</span></div>' +
        '<div class="mini-agenda-list"></div>' +
      '</button>' +
      '<div class="card side-card test-ready-card"><h3>🎯 Toets-klaar</h3><p class="stat-big side-prep-percent">0%</p><div class="small">van je onderdelen beheerst</div><div class="progress-wrap"><div class="progress-label"><span>3× achter elkaar goed = beheerst</span><span class="side-subject-count">0 vakken</span></div><div class="progress"><div class="progress-bar side-progress-bar" style="width:10%"></div></div></div><div class="card motivation"><strong>🎯 Goed bezig!</strong><br><span class="small">Elke dag een beetje oefenen maakt verschil.</span></div></div>' +
    '</aside>';
  }

  return Object.freeze({
    buildStudentSidebarHtml,
    buildParentSidebarHtml,
    buildRightSidebarHtml
  });
}
