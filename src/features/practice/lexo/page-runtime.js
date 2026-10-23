import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createLexoRuntime } from './runtime.js';
import { createLexoView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';

const GAME_KEYS = Object.freeze({ rookie: 'lexo_rookie', goat: 'lexo_goat' });

export function createLexoPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('LEXO runtime requires an app.');
  if (!templateMount) throw new TypeError('LEXO runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('LEXO runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createLexoView({ documentRef });
  const gameShell = documentRef.createElement('main');
  gameShell.className = 'practice-page-card lexo-page-card';
  gameShell.innerHTML = `
    <header class="lexo-head">
      <div class="lexo-stats" aria-label="Spelstatistieken">
        <div class="lexo-stat"><span>Niveau</span><strong id="lexoDifficulty">ROOKIE</strong></div>
        <div class="lexo-stat"><span>Punten</span><strong id="lexoScore">0</strong></div>
        <div class="lexo-stat"><span>Record</span><strong id="lexoRecord">—</strong></div>
        <div class="lexo-stat"><span>Vragen</span><strong id="lexoProgress">0 van 0</strong></div>
      </div>
      <label class="lexo-difficulty-control">Niveau<div id="lexoDifficultySelect"></div></label>
    </header>
    <section class="lexo-grid-panel" aria-label="Letterveld">
      <div id="lexoRules" class="lexo-rules" aria-label="Uitleg van LEXO"></div>
      <div id="lexoGrid" class="lexo-grid"></div>
      <p class="lexo-grid-hint">ROOKIE: 2 hulpletters · GOAT: 1 hulpletter</p>
    </section>
    <section class="lexo-question-panel">
      <span class="lexo-label">Lesvraag</span>
      <div id="lexoQuestionArea"></div>
    </section>
    <section id="lexoFeedback" class="lexo-feedback-panel" aria-live="polite"></section>`;
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
    if (!items.length) {
      gameShell.querySelector('#lexoQuestionArea').textContent = 'Deze les bevat nog geen vragen.';
      return;
    }

    const isDictation = lesson.type === 'dictation';
    let difficulty = 'rookie';
    let runtime = null;
    let highScore = null;

    async function loadHighScore() {
      highScore = await app.gameResults.getHighScore({ gameKey: GAME_KEYS[difficulty], lessonId, student });
    }

    async function saveScore(score) {
      const normalized = Math.max(0, Math.floor(Number(score) || 0));
      if (highScore != null && normalized <= highScore) return;
      await app.gameResults.saveResult({ gameKey: GAME_KEYS[difficulty], lessonId, student, score: normalized });
      highScore = normalized;
    }

    async function speakCurrentAnswer() {
      const state = runtime?.snapshot();
      if (!state?.current?.answer || typeof app.audio?.speak !== 'function') return;
      try {
        await app.audio.speak(state.current.answer, { language: 'nl' });
      } catch (error) {
        await render(error?.message || 'De dicteestem kon niet worden afgespeeld.');
      }
    }

    async function render(errorMessage = '') {
      const state = runtime.snapshot();
      view.renderStats(gameShell, state, highScore);
      view.renderRules(gameShell);
      view.renderGrid(gameShell, state);
      view.renderDifficulty(gameShell, difficulty, value => { void changeDifficulty(value); });
      view.renderFeedback(gameShell, state, () => { void continueAfterFeedback(); });

      if (state.phase === 'finished') {
        await saveScore(state.score);
        view.renderStats(gameShell, state, highScore);
        view.renderFinished(gameShell, state, () => { void restartGame(); }, goGames);
        return;
      }

      if (state.phase === 'word') {
        view.renderWordInput(gameShell, state, value => {
          try { runtime.submitWord(value); void render(); }
          catch (error) { void render(error?.message || 'Het woord kon niet worden verwerkt.'); }
        });
        return;
      }

      if (state.phase === 'question') {
        view.renderQuestion(
          gameShell,
          state,
          async answer => {
            try { await runtime.submitExerciseAnswer(answer); await render(); }
            catch (error) { await render(error?.message || 'Het antwoord kon niet worden verwerkt.'); }
          },
          { isDictation, onSpeak: speakCurrentAnswer }
        );
      }
    }

    async function continueAfterFeedback() {
      if (!runtime) return;
      runtime.continueAfterExerciseFeedback();
      runtime.continueAfterWordResult();
      await render();
    }

    async function restartGame() {
      runtime = createLexoRuntime({
        items,
        gradeAnswer: (question, answer, value) => app.grading.gradeAnswer(question, answer, value),
        difficulty
      });
      runtime.restart();
      await render();
    }

    async function changeDifficulty(value) {
      if (!['rookie', 'goat'].includes(value) || value === difficulty) return;
      difficulty = value;
      await loadHighScore();
      await restartGame();
    }

    await loadHighScore();
    await restartGame();
  }

  function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🔤`,
      title: 'LEXO',
      icon: '🔤',
      subtitle: 'Beantwoord de lesvragen en maak zoveel mogelijk woorden.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    void load().catch(error => {
      console.error('LEXO load error:', error);
      gameShell.textContent = `LEXO kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`;
    });
  }

  return Object.freeze({ mount, content });
}
