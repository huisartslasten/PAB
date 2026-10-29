import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createPracticeGameTemplate } from '../practice-game-template.js';
import { createWordChaseRuntime } from './runtime.js';
import { createWordChaseView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';

const GAME_KEYS = Object.freeze({ rookie: 'word_chase_rookie', goat: 'word_chase_goat' });
const WORD_CHASE_DIFFICULTIES = Object.freeze([
  Object.freeze({ value: 'rookie', label: 'ROOKIE — 2 letters' }),
  Object.freeze({ value: 'goat', label: 'GOAT — 1 letter' })
]);

export function createWordChasePageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Word Chase runtime requires an app.');
  if (!templateMount) throw new TypeError('Word Chase runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Word Chase runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createWordChaseView({ documentRef });
  let difficulty = 'rookie';
  let runtime = null;
  let highScore = null;
  let scoreGameKey = GAME_KEYS[difficulty];
  let items = [];
  let isDictation = false;

  const gameArea = documentRef.createElement('section');
  gameArea.className = 'wc-target-panel';
  gameArea.setAttribute('aria-label', 'Geheim woord');
  gameArea.innerHTML = `
    <span class="wc-label">Geheim woord</span>
    <div id="wcTarget" class="wc-target"></div>
    <span class="wc-hint">Beantwoord een vraag goed en jaag op het woord.</span>`;

  const exercise = documentRef.createElement('section');
  exercise.className = 'wc-question-panel';
  exercise.innerHTML = `
    <span class="wc-label">Lesvraag</span>
    <div id="wcQuestionArea"></div>`;

  const feedback = documentRef.createElement('section');
  feedback.id = 'wcFeedback';
  feedback.className = 'wc-feedback-panel';
  feedback.setAttribute('aria-live', 'polite');

  const gameTemplate = createPracticeGameTemplate({
    documentRef,
    className: 'wc-game-template',
    difficulty: 'rookie',
    difficultyOptions: WORD_CHASE_DIFFICULTIES,
    stats: [
      { id: 'score', label: 'Beurten', value: '0' },
      { id: 'record', label: 'Record', value: '—' },
      { id: 'progress', label: 'Vragen', value: '0 van 0' }
    ],
    onDifficultyChange: value => { void changeDifficulty(value); },
    gameArea,
    exercise,
    feedback
  });
  content.appendChild(gameTemplate.element);

  const goGames = () => {
    const target = buildViewUrl('games.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  async function loadHighScore() {
    scoreGameKey = GAME_KEYS[difficulty];
    highScore = await app.gameResults.getHighScore({ gameKey: scoreGameKey, lessonId, student });
  }

  async function saveScore(score) {
    const normalized = Math.max(0, Math.floor(Number(score) || 0));
    if (highScore != null && normalized >= highScore) return;
    await app.gameResults.saveResult({ gameKey: scoreGameKey, lessonId, student, score: normalized });
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
    view.renderTarget(gameTemplate.element, state);
    view.renderFeedback(gameTemplate.element, state, () => { void continueFromFeedback(); });

    if (state.phase === 'finished') {
      await saveScore(state.turns);
      view.renderStats(gameTemplate.element, state, highScore);
      view.renderFinished(gameTemplate.element, state, () => { void restartGame(); }, goGames);
      return;
    }

    if (state.phase === 'new-word') {
      const node = gameTemplate.element.querySelector('#wcQuestionArea');
      node.replaceChildren();
      const next = documentRef.createElement('div');
      next.className = 'wc-next-word';
      next.textContent = 'Woord gevonden! Klaar voor de volgende?';
      node.appendChild(next);
      return;
    }

    if (state.phase === 'question' || state.phase === 'word') {
      view.renderQuestion(
        gameTemplate.element,
        state,
        async answer => {
          try { await runtime.submitExerciseAnswer(answer); await render(); }
          catch (error) { await render(error?.message || 'Het antwoord kon niet worden verwerkt.'); }
        },
        value => {
          try { runtime.submitWord(value); void render(); }
          catch (error) { void render(error?.message || 'Het woord kon niet worden verwerkt.'); }
        },
        errorMessage,
        { isDictation, onSpeak: speakCurrentAnswer }
      );
    }
  }

  async function continueFromFeedback() {
    if (!runtime) return;
    const state = runtime.snapshot();
    if (state.feedback?.type === 'exercise') runtime.continueAfterExerciseFeedback();
    else runtime.continueAfterWordResult();
    await render();
  }

  async function restartGame() {
    runtime = createWordChaseRuntime({
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

    items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    if (!items.length) {
      gameTemplate.element.querySelector('#wcQuestionArea').textContent = 'Deze les bevat nog geen vragen.';
      return;
    }

    isDictation = lesson.type === 'dictation';
    await loadHighScore();
    await restartGame();
  }

  function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Word Chase',
      icon: '🏃',
      subtitle: 'Beantwoord de lesvragen en jaag op het geheime woord.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    void load().catch(error => {
      console.error('Word Chase load error:', error);
      gameTemplate.element.textContent = `Word Chase kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`;
    });
  }

  return Object.freeze({ mount, content });
}
