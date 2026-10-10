(async function bootstrapTestHistoryStorage() {
  const [{ createTestHistoryRenderer }, { installLessonPracticeIntegration, installLessonPracticeScrollMemory }] = await Promise.all([
    import('./src/features/test-history/test-history-renderer.js'),
    import('./src/features/practice/lesson-practice-navigation.js')
  ]);

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

  // V5.9 application integration: the practice navigation owns LESSEN → OEFENEN scroll state.
  installLessonPracticeScrollMemory({
    windowRef: window,
    documentRef: document
  });
  const stopLessonPracticeIntegration = installLessonPracticeIntegration({
    getCurrentLesson: () => currentLesson,
    documentRef: document,
    locationRef: window.location,
    windowRef: window
  });
  window.pacoGOPracticeIntegrationReady = Promise.resolve(stopLessonPracticeIntegration);
})().catch(error => {
  console.error('PacoGO test-history storage bootstrap failed:', error);
});
