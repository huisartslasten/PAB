import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { filterLessonItemsByContentKind } from '../../lessons/lesson-content-model.js';
import { createMemoryRuntime } from './runtime.js';
import { createMemoryView } from './view.js';
import { createPracticeGameTemplate } from '../practice-game-template.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';

export function createMemoryPageRuntime({ app, templateMount, context, lessonId = '', contentKind = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Memory runtime requires an app.');
  if (!templateMount) throw new TypeError('Memory runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Memory runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createMemoryView({ documentRef, escapeHtml });
  let timingMode = 'manual';
  let revealTimer = null;
  let bestScore = null;

  const goGames = () => {
    const target = buildViewUrl('games.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    if (contentKind) target.searchParams.set('content_kind', contentKind);
    return navigate(target);
  };

  function clearRevealTimer() {
    if (revealTimer !== null) {
      documentRef.defaultView?.clearTimeout?.(revealTimer);
      revealTimer = null;
    }
  }

  async function load() {
    if (!lessonId || !student) throw new Error('Geen leerling of les geselecteerd.');
    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
    if (!lesson) throw new Error('Deze les kon niet worden gevonden.');

    bestScore = await app.gameResults.getHighScore({ gameKey: 'memory', lessonId, student });
    content.appendChild(createLessonContextField(lesson, { documentRef }));

    const gameArea = documentRef.createElement('div');
    gameArea.className = 'memory-shell';
    const grid = documentRef.createElement('div');
    grid.className = 'memory-grid';
    grid.dataset.memoryGrid = 'true';
    const status = documentRef.createElement('div');
    status.className = 'memory-status';
    status.dataset.memoryStatus = 'true';
    const resolveButton = documentRef.createElement('button');
    resolveButton.type = 'button';
    resolveButton.className = 'memory-primary-button memory-resolve-button';
    resolveButton.textContent = 'KLAAR VOLGENDE';
    resolveButton.dataset.memoryResolve = 'true';
    const finished = documentRef.createElement('div');
    finished.className = 'memory-finished';
    finished.dataset.memoryFinished = 'true';
    finished.hidden = true;
    finished.innerHTML = '<div class="memory-finished-icon">🎉</div><h2>Alles gevonden!</h2><p data-memory-finished-text></p><button type="button" class="memory-primary-button" data-memory-finished-button>Nog een keer spelen</button>';
    const roundFinished = documentRef.createElement('div');
    roundFinished.className = 'memory-finished';
    roundFinished.dataset.memoryRoundFinished = 'true';
    roundFinished.hidden = true;
    roundFinished.innerHTML = '<div class="memory-finished-icon">👏</div><h2>Ronde klaar!</h2><p data-memory-round-finished-text></p><button type="button" class="memory-primary-button" data-memory-next-button>Volgende ronde</button>';
    gameArea.append(grid, status, resolveButton, roundFinished, finished);

    const gameTemplate = createPracticeGameTemplate({
      documentRef,
      className: 'memory-game-template',
      showDifficulty: false,
      stats: [
        { id: 'round', label: 'Ronde', value: '0/0' },
        { id: 'turns', label: 'Beurten', value: '0' },
        { id: 'minimum', label: 'Minimaal', value: '0' },
        { id: 'record', label: 'Beste', value: '—' }
      ],
      controls: view.createTimingControl({
        timingMode,
        onTimingModeChange: nextMode => {
          timingMode = nextMode;
          renderState();
        }
      }),
      gameArea
    });
    content.appendChild(gameTemplate.element);

    const items = filterLessonItemsByContentKind(lesson, contentKind);
    const runtime = createMemoryRuntime({ items });

    async function resolveTurn() {
      clearRevealTimer();
      if (runtime.snapshot().phase !== 'checking') return;
      const result = runtime.resolveTurn();
      renderState();
      if (result.phase === 'finished') {
        await app.gameResults.saveResult({ gameKey: 'memory', lessonId, student, score: result.turnCount });
        bestScore = await app.gameResults.getHighScore({ gameKey: 'memory', lessonId, student });
        renderState();
      }
    }

    function renderState() {
      const state = runtime.snapshot();
      clearRevealTimer();
      view.render({
        root: gameTemplate.element,
        state,
        bestScore,
        timingMode,
        onTimingModeChange: nextMode => { timingMode = nextMode; renderState(); },
        onResolveTurn: resolveTurn,
        onCardSelect: cardId => { runtime.selectCard(cardId); renderState(); },
        onNextRound: () => { runtime.startNextRound(); renderState(); },
        onFinished: () => { runtime.start(); renderState(); }
      });
      if (state.phase === 'checking' && timingMode !== 'manual') {
        const delay = Number(timingMode) * 1000;
        revealTimer = documentRef.defaultView?.setTimeout?.(resolveTurn, delay) ?? setTimeout(resolveTurn, delay);
      }
    }

    runtime.start();
    renderState();
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Memory',
      icon: '🧠',
      subtitle: 'Vind de vraag en het bijbehorende antwoord.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    try {
      await load();
    } catch (error) {
      console.error('Memory load error:', error);
      content.replaceChildren();
      const node = documentRef.createElement('div');
      node.className = 'practice-page-card';
      node.innerHTML = `<strong>Memory kon niet worden geladen.</strong><p class="small">${escapeHtml(error?.message || 'Onbekende fout.')}</p>`;
      content.appendChild(node);
    }
  }

  return Object.freeze({ mount, content });
}
