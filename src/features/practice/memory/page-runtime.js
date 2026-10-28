import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createMemoryRuntime } from './runtime.js';
import { createMemoryView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';

export function createMemoryPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Memory runtime requires an app.');
  if (!templateMount) throw new TypeError('Memory runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Memory runtime requires a navigation owner.');
  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createMemoryView({ documentRef, escapeHtml });
  let timingMode = 'manual';
  let revealTimer = null;
  let bestScore = null;
  const goGames = () => { const target = buildViewUrl('games.html', { student, mode: context?.mode }); if (lessonId) target.searchParams.set('lesson_id', lessonId); return navigate(target); };
  function clearRevealTimer() { if (revealTimer !== null) { documentRef.defaultView?.clearTimeout?.(revealTimer); revealTimer = null; } }
  async function load() {
    if (!lessonId || !student) throw new Error('Geen leerling of les geselecteerd.');
    const records = await app.loadLessons(); const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId)); if (!lesson) throw new Error('Deze les kon niet worden gevonden.');
    bestScore = await app.gameResults.getHighScore({ gameKey: 'memory', lessonId, student });
    content.appendChild(createLessonContextField(lesson, { documentRef })); const gameMount = documentRef.createElement('div'); content.appendChild(gameMount);
    const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    const runtime = createMemoryRuntime({ items });
    async function resolveTurn() { clearRevealTimer(); if (runtime.snapshot().phase !== 'checking') return; const result = runtime.resolveTurn(); renderState(); if (result.phase === 'finished') { await app.gameResults.saveResult({ gameKey: 'memory', lessonId, student, score: result.turnCount }); bestScore = await app.gameResults.getHighScore({ gameKey: 'memory', lessonId, student }); renderState(); } }
    function renderState() { const state = runtime.snapshot(); clearRevealTimer(); gameMount.replaceChildren(view.render({ state, bestScore, timingMode, onTimingModeChange: nextMode => { timingMode = nextMode; renderState(); }, onResolveTurn: resolveTurn, onCardSelect: cardId => { runtime.selectCard(cardId); renderState(); }, onNextRound: () => { runtime.startNextRound(); renderState(); }, onFinished: () => { runtime.start(); renderState(); } })); if (state.phase === 'checking' && timingMode !== 'manual') { const delay = Number(timingMode) * 1000; revealTimer = documentRef.defaultView?.setTimeout?.(resolveTurn, delay) ?? setTimeout(resolveTurn, delay); } }
    runtime.start(); renderState();
  }
  async function mount() { mountPacoPageTemplate({ mount: templateMount, backLabel: '← Spelletjes', backAction: goGames, greeting: `Hoi ${student}! 🐶`, title: 'Memory', icon: '🧠', subtitle: 'Vind de vraag en het bijbehorende antwoord.', navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }), content }); try { await load(); } catch (error) { console.error('Memory load error:', error); content.replaceChildren(); const node = documentRef.createElement('div'); node.className = 'practice-page-card'; node.innerHTML = `<strong>Memory kon niet worden geladen.</strong><p class="small">${escapeHtml(error?.message || 'Onbekende fout.')}</p>`; content.appendChild(node); } }
  return Object.freeze({ mount, content });
}
