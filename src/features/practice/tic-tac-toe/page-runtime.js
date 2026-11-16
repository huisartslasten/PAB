import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createTicTacToeRuntime, TIC_TAC_TOE_AI_LEVELS, TIC_TAC_TOE_MODES } from './runtime.js';
import { createTicTacToeView } from './view.js';
import { createPracticeGameTemplate } from '../practice-game-template.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';

export function createTicTacToePageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Tic-Tac-Toe runtime requires an app.');
  if (!templateMount) throw new TypeError('Tic-Tac-Toe runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Tic-Tac-Toe runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  let handleModeChange = null;
  const gameArea = documentRef.createElement('div');
  gameArea.innerHTML = '<div id="ticTacToeBoard" class="ttt-board" aria-label="Tic-Tac-Toe bord"></div><div id="tttContent" class="ttt-content"></div>';
  const view = createTicTacToeView({ documentRef, escapeHtml, root: gameArea });
  const gameTemplate = createPracticeGameTemplate({
    documentRef,
    className: 'ttt-game-template',
    stats: [
      { id: 'score', label: 'Score', value: '0 🏆' },
      { id: 'record', label: 'Record', value: '0 🥇' },
      { id: 'progress', label: 'Vragen', value: '0 van 0' }
    ],
    difficulty: 'rookie',
    difficultyOptions: TIC_TAC_TOE_AI_LEVELS,
    onDifficultyChange: value => handleModeChange?.({ level: value }),
    controls: view.createModeControl(TIC_TAC_TOE_MODES, value => handleModeChange?.({ gameMode: value })),
    gameArea
  });
  content.appendChild(gameTemplate.element);

  const goGames = () => {
    const target = buildViewUrl('games.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  async function load() {
    if (!lessonId || !student) {
      gameTemplate.element.replaceChildren();
      gameTemplate.element.textContent = !student ? 'Geen leerling geselecteerd.' : 'Geen les geselecteerd.';
      return;
    }

    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
    if (!lesson) throw new Error('Deze les kon niet worden gevonden.');

    content.insertBefore(createLessonContextField(lesson, { documentRef }), gameTemplate.element);
    const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    const runtime = createTicTacToeRuntime({ items, gradeAnswer: (question, answer, value) => app.grading.gradeAnswer(question, answer, value) });

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
      gameTemplate.dropdown.setValue(enriched.aiLevel);
      view.setModeValue(enriched.mode);
      view.renderStats(enriched);
      view.renderBoard(enriched, cell => {
        try { runtime.selectCell(cell); void render(); } catch (error) { void render(error?.message || 'Dit vakje kan nu niet worden gekozen.'); }
      });

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
        const contentNode = gameTemplate.element.querySelector('#tttContent');
        if (contentNode) contentNode.innerHTML = '<div class="ttt-turn">Kies een vakje. Eerst goed antwoorden, dan is het jouw X. ❌</div>';
      }
    }

    handleModeChange = ({ gameMode = null, level = null } = {}) => {
      const state = runtime.snapshot();
      runtime.start({ gameMode: gameMode || state.mode, level: level || state.aiLevel });
      void render();
    };

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
    try { await load(); } catch (error) { console.error('Tic-Tac-Toe load error:', error); gameTemplate.element.textContent = `Tic-Tac-Toe kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`; }
  }

  return Object.freeze({ mount, content });
}
