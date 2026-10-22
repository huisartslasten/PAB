import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createTicTacToeRuntime, TIC_TAC_TOE_AI_LEVELS, TIC_TAC_TOE_MODES } from './runtime.js';
import { createTicTacToeView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';

export function createTicTacToePageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Tic-Tac-Toe runtime requires an app.');
  if (!templateMount) throw new TypeError('Tic-Tac-Toe runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Tic-Tac-Toe runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createTicTacToeView({ documentRef, escapeHtml });
  const gameShell = documentRef.createElement('main');
  gameShell.className = 'practice-page-card ttt-page-card';
  gameShell.innerHTML = `<div class="ttt-game-head"><h1 class="ttt-game-title"><span class="ttt-mark ttt-mark-o">O</span> TIC-TAC-TOE <span class="ttt-mark ttt-mark-x">X</span></h1><div class="ttt-stats"><div class="ttt-stat"><span>Score</span><strong id="tttScore">0 🏆</strong></div><div class="ttt-stat"><span>Record</span><strong id="tttRecord">0 🥇</strong></div><div class="ttt-stat"><span>Vragen</span><strong id="tttProgress">0 van 0</strong></div></div></div><div class="ttt-settings"><div class="ttt-setting"><span class="ttt-setting-label">Modus</span><div id="tttMode"></div></div><div class="ttt-setting"><span class="ttt-setting-label">Paco</span><div id="tttLevel"></div></div></div><div id="ticTacToeBoard" class="ttt-board" aria-label="Tic-Tac-Toe bord"></div><div id="tttContent" class="ttt-content"></div>`;
  content.appendChild(gameShell);

  const goGames = () => {
    const target = buildViewUrl('games.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  async function load() {
    if (!lessonId || !student) {
      gameShell.replaceChildren();
      gameShell.textContent = !student ? 'Geen leerling geselecteerd.' : 'Geen les geselecteerd.';
      return;
    }

    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
    if (!lesson) throw new Error('Deze les kon niet worden gevonden.');

    const contextField = createLessonContextField(lesson, { documentRef });
    content.insertBefore(contextField, gameShell);

    const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    const runtime = createTicTacToeRuntime({
      items,
      gradeAnswer: (question, answer, value) => app.grading.gradeAnswer(question, answer, value)
    });

    let highScore = await app.gameResults.getHighScore({ gameKey: 'tic_tac_toe', lessonId, student });
    highScore = highScore == null ? 0 : highScore;
    let cancelPacoTurn = () => {};

    async function persistScore(score) {
      const normalizedScore = Math.max(0, Math.floor(Number(score) || 0));
      if (normalizedScore <= highScore) return;
      await app.gameResults.saveResult({ gameKey: 'tic_tac_toe', lessonId, student, score: normalizedScore });
      highScore = normalizedScore;
    }

    async function render(errorMessage = '') {
      cancelPacoTurn();
      cancelPacoTurn = () => {};

      const state = runtime.snapshot();
      const enriched = { ...state, bestScore: Math.max(highScore, state.bestScore) };
      view.renderStats(enriched);
      view.renderBoard(enriched, cell => {
        try { runtime.selectCell(cell); void render(); } catch (error) { void render(error?.message || 'Dit vakje kan nu niet worden gekozen.'); }
      });
      view.renderSettings(
        enriched,
        TIC_TAC_TOE_MODES,
        TIC_TAC_TOE_AI_LEVELS,
        value => { runtime.start({ gameMode: value, level: enriched.aiLevel }); void render(); },
        value => { runtime.start({ gameMode: enriched.mode, level: value }); void render(); }
      );

      if (enriched.phase === 'finished') {
        await persistScore(enriched.score);
        const finalState = { ...runtime.snapshot(), bestScore: highScore };
        view.renderStats(finalState);
        view.renderBoard(finalState, () => {});
        view.renderFinished(finalState, () => { runtime.start({ gameMode: finalState.mode, level: finalState.aiLevel }); void render(); }, goGames);
        return;
      }

      if (enriched.phase === 'game-over') {
        view.renderGameResult(enriched, () => { runtime.continueAfterGame(); void render(); });
        return;
      }

      if (enriched.phase === 'question') {
        view.renderQuestion(enriched, async answer => {
          try { await runtime.submitAnswer(answer); await render(); } catch (error) { await render(error?.message || 'Het antwoord kon niet worden verwerkt.'); }
        }, errorMessage);
        return;
      }

      if (enriched.phase === 'paco') {
        cancelPacoTurn = view.renderPacoTurn(enriched, () => {
          try { runtime.playPacoMove(); } catch (error) { console.error('Tic-Tac-Toe Paco move error:', error); } finally { void render(); }
        });
        return;
      }

      if (enriched.phase === 'choosing') {
        const contentNode = documentRef.getElementById('tttContent');
        if (contentNode) contentNode.innerHTML = '<div class="ttt-turn">Kies een vakje. Eerst goed antwoorden, dan is het jouw X. ❌</div>';
      }
    }

    runtime.start({ gameMode: 'classic', level: 'rookie' });
    await render();
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Tic-Tac-Toe',
      icon: '⭕',
      subtitle: 'Speel Tic-Tac-Toe met de vragen uit deze les.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    try { await load(); } catch (error) { console.error('Tic-Tac-Toe load error:', error); gameShell.textContent = `Tic-Tac-Toe kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`; }
  }

  return Object.freeze({ mount, content });
}
