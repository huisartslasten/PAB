import { createTestHistoryRenderer } from './src/features/test-history/test-history-renderer.js';

const testHistoryRenderer = createTestHistoryRenderer({
  getLessons: () => lessons,
  escapeHtml,
  documentRef: document
});

const testHistoryRuntimeBridge = Object.defineProperties({}, {
  db: { get: () => db },
  requireParent: { get: () => requireParent },
  hideAll: { get: () => hideAll },
  showPage: { get: () => () => document.getElementById('testHistory').classList.remove('hidden') },
  setGreeting: { get: () => studentFilter => {
    const historyGreeting = document.getElementById('testHistoryGreeting');
    if (historyGreeting) historyGreeting.textContent = (studentFilter || currentStudent) ? 'Hoi ' + (studentFilter || currentStudent) + '! 🐶' : '';
  } },
  setLoading: { get: () => () => {
    const el = document.getElementById('testHistoryContent');
    if (el) el.innerHTML = '<div class="card">Toetsgeschiedenis laden...</div>';
  } },
  refreshSidebars: { get: () => refreshPageSidebars },
  renderAttempts: { get: () => testHistoryRenderer },
  renderError: { get: () => error => {
    const el = document.getElementById('testHistoryContent');
    if (el) el.innerHTML = '<div class="card message error">De toetsgeschiedenis kon niet worden geladen.</div>';
    console.error('Test history load error:', error);
  } },
  currentStudent: { get: () => currentStudent },
  currentLesson: { get: () => currentLesson }
});

const testAttemptRuntimeBridge = Object.defineProperties({}, {
  db: { get: () => db },
  currentStudent: { get: () => currentStudent },
  currentLesson: { get: () => currentLesson }
});

const testHistoryRuntimeBootstrap = import('./src/features/test-history/test-history-runtime-bootstrap.js')
  .then(({ bootstrapTestHistoryRuntime }) => bootstrapTestHistoryRuntime({
    runtime: testHistoryRuntimeBridge,
    target: window
  }));

window.pacoGOTestHistoryRuntimeReady = testHistoryRuntimeBootstrap;
window.showTestHistoryRuntime = async function showTestHistoryRuntimeFacade(studentFilter = '') {
  const runtimeHandler = await testHistoryRuntimeBootstrap;
  return runtimeHandler(studentFilter);
};

const testAttemptRuntimeBootstrap = import('./src/features/test-history/test-attempt-runtime-bootstrap.js')
  .then(({ bootstrapTestAttemptRuntime }) => bootstrapTestAttemptRuntime({
    runtime: testAttemptRuntimeBridge,
    target: window
  }));

window.pacoGOTestAttemptRuntimeReady = testAttemptRuntimeBootstrap;
window.saveTestAttempt = async function saveTestAttemptRuntimeFacade(attempt) {
  const runtimeHandler = await testAttemptRuntimeBootstrap;
  return runtimeHandler(attempt);
};

/* Flashcards: LES → OEFENEN → Flashcards. Keep the existing lesson-choice flow. */
const originalPacoOpenLesson = window.openLesson;
window.openLesson = function flashcardAwareOpenLesson(id) {
  const result = originalPacoOpenLesson?.(id);
  const lesson = lessons.find(item => Number(item.id) === Number(id));
  if (!lesson) return result;

  const choiceGrid = document.getElementById('choiceGrid');
  if (!choiceGrid) return result;

  const practiceChoice = [...choiceGrid.querySelectorAll('button.choice')]
    .find(button => button.querySelector('h3')?.textContent.trim() === 'Oefenen');
  if (!practiceChoice) return result;

  practiceChoice.onclick = () => {
    const target = new URL('oefenen.html', window.location.href);
    target.searchParams.set('lesson_id', String(lesson.id));
    target.searchParams.set('student', String(lesson.student || currentStudent || 'Zyon'));
    target.searchParams.set('subject', String(lesson.subject || 'Deze les'));
    target.searchParams.set('title', String(lesson.title || 'Oefenen'));
    target.searchParams.set('items', String((lesson.lesson_items || []).length));
    window.location.href = target.toString();
  };

  return result;
};
