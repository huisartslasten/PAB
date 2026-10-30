import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createPracticeGameTemplate } from '../practice-game-template.js';
import { createRockPaperScissorsRuntime } from './runtime.js';
import { createRockPaperScissorsView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';

export function createRockPaperScissorsPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Rock Paper Scissors runtime requires an app.');
  if (!templateMount) throw new TypeError('Rock Paper Scissors runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Rock Paper Scissors runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const gameArea = documentRef.createElement('div');
  gameArea.innerHTML = '<div class="rps-progress-wrap" data-rps-progress></div><div class="rps-content" data-rps-content></div>';
  const gameTemplate = createPracticeGameTemplate({
    documentRef,
    className: 'rock-paper-scissors-game-template',
    showDifficulty: false,
    stats: [
      { id: 'score', label: 'Score', value: '0' },
      { id: 'maximum', label: 'Maximum', value: '0' },
      { id: 'highScore', label: 'High score', value: '0' }
    ],
    gameArea
  });
  const view = createRockPaperScissorsView({ documentRef, escapeHtml, root: gameTemplate.element });
  content.appendChild(gameTemplate.element);

  const goGames = () => {
    const target = buildViewUrl('games.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  async function load() {
    if (!lessonId || !student) throw new Error('Geen leerling of les geselecteerd.');
    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
    if (!lesson) throw new Error('Deze les kon niet worden gevonden.');

    const contextField = createLessonContextField(lesson, { documentRef });
    content.insertBefore(contextField, gameTemplate.element);

    const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    const runtime = createRockPaperScissorsRuntime({ items });
    let highScore = await app.gameResults.getHighScore({ gameKey: 'rock-paper-scissors', lessonId, student });
    highScore = highScore == null ? 0 : highScore;

    async function persistScore(score) {
      const normalizedScore = Math.max(0, Math.floor(Number(score) || 0));
      if (normalizedScore <= highScore) return;
      await app.gameResults.saveResult({ gameKey: 'rock-paper-scissors', lessonId, student, score: normalizedScore });
      highScore = normalizedScore;
    }

    function renderState() {
      const state = runtime.snapshot();
      if (state.phase === 'finished') {
        persistScore(state.score)
          .then(() => view.renderFinished(state, highScore, restart, goGames))
          .catch(error => renderError(error));
        return;
      }
      if (state.phase === 'question') {
        view.renderQuestion(state, answer => { runtime.submitAnswer(answer); renderState(); }, highScore);
        return;
      }
      if (state.phase === 'feedback') {
        view.renderFeedback(state, highScore, () => { runtime.continueAfterFeedback(); renderState(); });
        return;
      }
      if (state.phase === 'choice') {
        view.renderChoice(state, choice => { runtime.choose(choice); renderState(); }, highScore);
        return;
      }
      if (state.phase === 'reveal') {
        view.renderReveal(state, () => { runtime.reveal(); renderState(); }, highScore);
        return;
      }
      view.renderResult(state, highScore, () => { runtime.continueGame(); renderState(); });
    }

    function restart() {
      runtime.start();
      renderState();
    }

    restart();
  }

  function renderError(error) {
    const node = documentRef.createElement('div');
    node.className = 'practice-content';
    node.innerHTML = `<strong>Rock Paper Scissors kon niet worden geladen.</strong><p class="small">${escapeHtml(error?.message || 'Onbekende fout.')}</p>`;
    gameTemplate.element.replaceChildren(node);
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Rock Paper Scissors',
      icon: '🪨',
      subtitle: 'Beantwoord de vraag, kies jouw kaart en ontdek Paco’s keuze.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    try {
      await load();
    } catch (error) {
      console.error('Rock Paper Scissors load error:', error);
      renderError(error);
    }
  }

  return Object.freeze({ mount, content });
}
