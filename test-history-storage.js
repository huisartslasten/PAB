const testHistoryRuntimeBridge = Object.defineProperties({}, {
  db: { get: () => db },
  requireParent: { get: () => requireParent },
  hideAll: { get: () => hideAll },
  showPage: { get: () => () => document.getElementById('testHistory')?.classList.remove('hidden') },
  setGreeting: { get: () => student => {
    const el = document.getElementById('testHistoryGreeting');
    if (el) el.textContent = student ? 'Hoi '+student+'! 🐶' : '';
  } },
  setLoading: { get: () => () => {
    const el = document.getElementById('testHistoryContent');
    if (el) el.innerHTML = '<div class="card">Toetsgeschiedenis laden...</div>';
  } },
  refreshSidebars: { get: () => refreshPageSidebars },
  renderAttempts: { get: () => data => {
    const el = document.getElementById('testHistoryContent');
    if (!el) return;
    if (!data?.length) {
      const student = testHistoryRuntimeBridge.currentStudent;
      el.innerHTML = '<div class="card empty">'+(student?'Nog geen gemaakte toetsen voor '+escapeHtml(student)+'.':'Nog geen gemaakte toetsen opgeslagen.')+'</div>';
      return;
    }
    const lessonMap = new Map(lessons.map(l => [Number(l.id), l]));
    el.innerHTML = data.map(a => {
      const lesson = lessonMap.get(Number(a.lesson_id));
      const pct = a.total_questions ? Math.round(a.score/a.total_questions*100) : 0;
      const errors = Math.max(0,(a.total_questions||0)-(a.score||0));
      const date = a.completed_at ? new Intl.DateTimeFormat('nl-NL',{dateStyle:'medium',timeStyle:'short'}).format(new Date(a.completed_at)) : 'Onbekende datum';
      const answers = (a.test_attempt_answers||[]).sort((x,y) => x.question_order-y.question_order);
      return '<details class="test-history-item"><summary><div class="test-history-main"><div><strong>'+escapeHtml(lesson?.subject||'Toets')+' — '+escapeHtml(lesson?.title||('Les '+a.lesson_id))+'</strong><div class="small">'+escapeHtml(a.student)+' · '+date+'</div></div><div class="test-history-summary"><span>'+a.total_questions+' vragen</span><span>'+a.score+' goed</span><span class="'+(errors?'history-errors':'history-ok')+'">'+errors+' fouten</span></div></div></summary><div class="test-history-details"><div class="test-history-score">'+a.score+'/'+a.total_questions+' goed ('+pct+'%)</div>'+answers.map(x=>'<div class="result-item '+(x.is_correct?'correct':'incorrect')+'"><strong>'+x.question_order+'. '+escapeHtml(x.question)+'</strong><br>Antwoord van leerling: '+escapeHtml(x.given_answer||'—')+'<br>'+(x.is_correct?'✓ Goed':'✗ Verwacht: '+escapeHtml(x.expected_answer||'—'))+'</div>').join('')+'</div></details>';
    }).join('');
  } },
  renderError: { get: () => error => {
    console.error('Test history load error:', error);
    const el = document.getElementById('testHistoryContent');
    if (el) el.innerHTML = '<div class="card message error">De toetsgeschiedenis kon niet worden geladen.</div>';
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
window.showTestHistoryRuntime = async function showTestHistoryRuntimeFacade(studentFilter='') {
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
