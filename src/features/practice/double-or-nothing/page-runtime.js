import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createDoubleOrNothingRuntime } from './runtime.js';
import { createDoubleOrNothingView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';

export function createDoubleOrNothingPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Double or Nothing runtime requires an app.');
  if (!templateMount) throw new TypeError('Double or Nothing runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Double or Nothing runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createDoubleOrNothingView({ documentRef, escapeHtml });
  const gameShell = documentRef.createElement('main');
  gameShell.className = 'practice-page-card';
  gameShell.innerHTML = `<div class="double-game-head"><h1 class="double-game-title">🐶 DOUBLE OR NOTHING</h1><div class="double-stats"><div class="double-stat"><span class="double-stat-label">Botjes</span><span id="doubleScore" class="double-stat-value">0 🦴</span></div><div class="double-stat"><span class="double-stat-label">Record</span><span id="doubleRecord" class="double-stat-value">0 🏆</span></div><div class="double-stat"><span class="double-stat-label">Maximaal</span><span id="doubleGoal" class="double-stat-value">0 🎯</span></div></div></div><div id="doubleProgress" class="practice-progress"></div><div id="doubleStake"></div><div id="doubleContent" class="practice-content"></div>`;
  content.appendChild(gameShell);

  const goGames = () => {
    const target = buildViewUrl('games.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  function renderEmptyState(message) {
    gameShell.replaceChildren();
    const state = documentRef.createElement('div');
    state.className = 'practice-content';
    state.textContent = message;
    gameShell.appendChild(state);
  }

  async function load() {
    if (!lessonId || !student) {
      renderEmptyState(!student ? 'Geen leerling geselecteerd.' : 'Geen les geselecteerd.');
      return;
    }

    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
    if (!lesson) throw new Error('Deze les kon niet worden gevonden.');

    const contextField = createLessonContextField(lesson, { documentRef });
    content.insertBefore(contextField, gameShell);

    const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    const runtime = createDoubleOrNothingRuntime({
      items,
      gradeAnswer: (question, answer, value) => app.grading.gradeAnswer(question, answer, value)
    });

    let highScore = await app.gameResults.getHighScore({
      gameKey: 'double_or_nothing',
      lessonId,
      student
    });

    function currentState() {
      const state = runtime.snapshot();
      return { ...state, bestScore: Math.max(highScore, state.bestScore) };
    }

    async function persistScore(score) {
      const normalizedScore = Math.max(0, Math.floor(Number(score) || 0));
      if (normalizedScore <= highScore) return;
      await app.gameResults.saveResult({
        gameKey: 'double_or_nothing',
        lessonId,
        student,
        score: normalizedScore
      });
      highScore = normalizedScore;
    }

    async function renderState(errorMessage = '') {
      const state = currentState();
      if (state.phase === 'finished') {
        await persistScore(state.score);
        view.renderFinished({ ...currentState(), bestScore: highScore }, restart, goGames);
        return;
      }
      if (state.phase === 'result') {
        view.renderResult({ ...currentState(), bestScore: highScore }, () => {
          runtime.continueGame();
          void renderState();
        });
        return;
      }
      view.renderQuestion(state, amount => {
        runtime.chooseStake(amount);
        void renderState();
      }, async answer => {
        try {
          await runtime.submitAnswer(answer);
          await renderState();
        } catch (error) {
          await renderState(error?.message || 'Het antwoord kon niet worden verwerkt.');
        }
      }, errorMessage);
    }

    function restart() {
      runtime.start();
      void renderState();
    }

    restart();
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Double or Nothing',
      icon: '🦴',
      subtitle: 'Elke vraag kan je botjes opleveren — of kosten.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });

    try {
      await load();
    } catch (error) {
      console.error('Double or Nothing load error:', error);
      renderEmptyState(`Double or Nothing kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`);
    }
  }

  return Object.freeze({ mount, content });
}
