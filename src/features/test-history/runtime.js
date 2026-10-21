import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createTestHistoryRenderer } from './test-history-renderer.js';
import { escapeHtml } from '../../core/html.js';
import { buildViewUrl } from '../../core/view-context.js';

export function createTestHistoryRuntime({
  app,
  templateMount,
  context,
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Test-history runtime requires the application context.');
  if (!templateMount) throw new TypeError('Test-history runtime requires a template mount.');
  if (!context) throw new TypeError('Test-history runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Test-history runtime requires central navigation.');

  const requestedStudent = context.student;
  const isManagementView = context.mode === 'management';
  const content = documentRef.createElement('div');
  content.className = 'history-shell';
  content.innerHTML = '<div id="testHistoryContent" class="history-content"><div class="history-loading">Toetsgeschiedenis laden…</div></div>';
  const historyContent = content.querySelector('#testHistoryContent');

  const renderAttempts = createTestHistoryRenderer({
    getLessons: () => app.state.lessons,
    escapeHtml,
    documentRef
  });

  const renderError = error => {
    historyContent.innerHTML = `<div class="history-error"><strong>De toetsgeschiedenis kon niet worden geladen.</strong><p class="small">${escapeHtml(error?.message || 'Onbekende fout.')}</p></div>`;
  };

  const loadHistory = async () => {
    historyContent.innerHTML = '<div class="history-loading">Toetsgeschiedenis laden…</div>';
    try {
      const attempts = await app.testHistory.listAttempts(requestedStudent);
      renderAttempts(attempts, requestedStudent);
      return attempts;
    } catch (error) {
      console.error('Test history load error:', error);
      renderError(error);
      return [];
    }
  };

  return {
    async mount() {
      mountPacoPageTemplate({
        mount: templateMount,
        backLabel: '← Dashboard',
        backAction: () => navigate(buildViewUrl(isManagementView ? 'management.html' : 'dashboard.html', {
          student: requestedStudent,
          mode: context.mode
        })),
        greeting: isManagementView ? 'PacoGO beheer ⚙️' : `Hoi ${requestedStudent}! 🐶`,
        title: 'Toetsgeschiedenis',
        icon: '📝',
        subtitle: requestedStudent
          ? `Bekijk de gemaakte toetsen van ${requestedStudent}.`
          : 'Bekijk de gemaakte toetsen van alle leerlingen.',
        navigation: createPacoNavigation({
          app,
          active: 'test-history',
          student: requestedStudent,
          viewMode: context.mode,
          navigate
        }),
        content
      });

      try {
        const session = await app.initializeSession();
        if (isManagementView && (!session || !app.auth.isParent)) {
          historyContent.innerHTML = '<div class="history-error"><strong>Geen toegang.</strong><p class="small">Toetsgeschiedenis is alleen beschikbaar voor beheerders.</p></div>';
          return;
        }

        await app.loadLessons();
        await loadHistory();
      } catch (error) {
        console.error('Test history initialization error:', error);
        renderError(error);
      }
    }
  };
}
