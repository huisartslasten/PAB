import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createPracticeGameTemplate } from '../practice-game-template.js';
import { createLexoRuntime } from './runtime.js';
import { createLexoView } from './view.js';
import { mountPracticeGameHelp } from '../practice-game-help.js';
import { buildViewUrl } from '../../../core/view-context.js';

const GAME_KEYS = Object.freeze({ rookie: 'lexo_rookie', goat: 'lexo_goat' });
const LEXO_DIFFICULTIES = Object.freeze([
  Object.freeze({ value: 'rookie', label: 'ROOKIE — 2 letters' }),
  Object.freeze({ value: 'goat', label: 'GOAT — 1 letter' })
]);

export function createLexoPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('LEXO runtime requires an app.');
  if (!templateMount) throw new TypeError('LEXO runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('LEXO runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createLexoView({ documentRef });
  const gameArea = documentRef.createElement('div');
  gameArea.innerHTML = '<div id="lexoGrid" class="lexo-grid"></div><p class="lexo-grid-hint">ROOKIE: 2 hulpletters · GOAT: 1 hulpletter</p>';
  const exercise = documentRef.createElement('div');
  exercise.innerHTML = '<span class="lexo-label">Lesvraag</span><div id="lexoQuestionArea"></div>';
  const feedback = documentRef.createElement('div');
  feedback.id = 'lexoFeedback';
  feedback.setAttribute('aria-live', 'polite');
  const gameTemplate = createPracticeGameTemplate({
    documentRef,
    className: 'lexo-game-template',
    difficulty: 'rookie',
    difficultyOptions: LEXO_DIFFICULTIES,
    stats: [
      { id: 'score', label: 'Punten', value: '0' },
      { id: 'record', label: 'Record', value: '—' },
      { id: 'progress', label: 'Vragen', value: '0 van 0' }
    ],
    onDifficultyChange: value => { void changeDifficulty(value); },
    gameArea,
    exercise,
    feedback
  });
  content.appendChild(gameTemplate.element);
  mountPracticeGameHelp(gameTemplate.element.querySelector('.practice-game-area'), {
    documentRef,
    title: 'Zo speel je LEXO',
    paragraphs: [
      'Maak woorden door letters horizontaal, verticaal of diagonaal met elkaar te verbinden.',
      'Je mag een letter binnen één woord niet opnieuw gebruiken.',
      'Langere woorden leveren meer punten op.'
    ]
  });

  const goGames = () => {
    const target = buildViewUrl('games.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  let difficulty = 'rookie';
  let runtime = null;
  let highScore = null;

  async function load() {
    if (!lessonId || !student) {
      gameTemplate.element.replaceChildren();
      gameTemplate.element.textContent = !student ? 'Geen leerling geselecteerd.' : 'Geen les geselecteerd.';
      return;
    }

    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
    if (!lesson) throw new Error('Deze les kon niet worden gevonden.');

    const contextField = createLessonContextField(lesson, { documentRef });
    content.insertBefore(contextField, gameTemplate.element);

    const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    if (!items.length) {
      gameTemplate.element.querySelector('#lexoQuestionArea').textContent = 'Deze les bevat nog geen vragen.';
      return;
    }

    const isDictation = lesson.type === 'dictation';

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
      view.renderStats(gameTemplate.element, state, highScore);
      view.renderGrid(gameTemplate.element, state);
      view.renderFeedback(gameTemplate.element, state, () => { void continueAfterFeedback(); });

      if (errorMessage) {
        const feedbackNode = gameTemplate.element.querySelector('#lexoFeedback');
        if (feedbackNode) feedbackNode.textContent = errorMessage;
      }

      if (state.phase === 'finished') {
        await saveScore(state.score);
        view.renderStats(gameTemplate.element, state, highScore);
        view.renderFinished(gameTemplate.element, state, () => { void restartGame(); }, goGames);
        return;
      }

      if (state.phase === 'word') {
        view.renderWordInput(gameTemplate.element, state, value => {
          try { runtime.submitWord(value); void render(); }
          catch (error) { void render(error?.message || 'Het woord kon niet worden verwerkt.'); }
        });
        return;
      }

      if (state.phase === 'question') {
        view.renderQuestion(
          gameTemplate.element,
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
      gameTemplate.element.textContent = `LEXO kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`;
    });
  }

  return Object.freeze({ mount, content });
}
