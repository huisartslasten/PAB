import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createPracticeGameTemplate, PRACTICE_PACO_THINKING_DELAY_MS, schedulePacoTurn } from '../practice-game-template.js';
import { createConnectTheDotsRuntime } from './runtime.js';
import { createConnectTheDotsView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';

const GAME_KEY = 'connect-the-dots';

export function createConnectTheDotsPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app || !templateMount || typeof navigate !== 'function') {
    throw new TypeError('Connect the Dots runtime requires app, template mount and navigation.');
  }

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  let runtime = null;
  let view = null;
  let shell = null;
  let gameArea = null;
  let exercise = null;
  let feedback = null;
  let statsElement = null;
  let thinkingCancel = () => {};
  let highScore = null;
  let items = [];
  let errorMessage = '';

  const goGames = () => navigate(buildViewUrl('games.html', { student, mode: context?.mode, lesson_id: lessonId }));

  function renderStats(state) {
    const stats = [
      { label: 'Jij', value: String(state.playerBoxes) },
      { label: 'Paco', value: String(state.pacoBoxes) },
      { label: 'Vakjes', value: String(state.totalBoxes) }
    ];

    statsElement.replaceChildren(...stats.map(({ label, value }) => {
      const node = documentRef.createElement('div');
      node.className = 'practice-game-stat';
      const statLabel = documentRef.createElement('span');
      statLabel.textContent = label;
      const statValue = documentRef.createElement('strong');
      statValue.textContent = value;
      node.append(statLabel, statValue);
      return node;
    }));
  }

  async function saveScore(state) {
    if (state.gameResult !== 'X') return;
    const score = Math.max(0, Math.floor(Number(state.playerBoxes) || 0));
    if (highScore != null && score <= highScore) return;
    await app.gameResults.saveResult({ gameKey: GAME_KEY, lessonId, student, score });
    highScore = score;
  }

  function schedulePacoMove() {
    thinkingCancel();
    thinkingCancel = schedulePacoTurn({
      onTurn: async () => {
        thinkingCancel = () => {};
        try {
          await renderState(runtime.playPacoMove());
        } catch (error) {
          errorMessage = error?.message || 'Paco kon zijn zet niet doen.';
          await renderState(runtime.snapshot());
        }
      },
      delayMs: PRACTICE_PACO_THINKING_DELAY_MS
    });
  }

  async function renderState(state) {
    renderStats(state);
    thinkingCancel();
    thinkingCancel = () => {};

    view.render(gameArea, state, {
      onEdge: async key => {
        try {
          errorMessage = '';
          await renderState(runtime.selectEdge(key));
        } catch (error) {
          errorMessage = error?.message || 'Deze lijn kan nu niet worden gekozen.';
          await renderState(runtime.snapshot());
        }
      }
    });

    if (state.phase === 'question') {
      view.renderQuestion(exercise, state, async answer => {
        try {
          errorMessage = '';
          await renderState(await runtime.submitAnswer(answer));
        } catch (error) {
          errorMessage = error?.message || 'Het antwoord kon niet worden verwerkt.';
          await renderState(runtime.snapshot());
        }
      }, errorMessage);
    } else {
      exercise.replaceChildren();
    }

    if (state.lastResult) {
      view.renderFeedback(feedback, state, () => renderState(runtime.snapshot()));
    } else {
      feedback.replaceChildren();
    }

    if (state.phase === 'paco') {
      schedulePacoMove();
      return;
    }

    if (state.phase === 'finished') {
      await saveScore(state);
      const result = documentRef.createElement('div');
      result.className = 'ctd-finished';
      const title = documentRef.createElement('strong');
      title.textContent = 'Potje afgelopen!';
      const text = documentRef.createElement('span');
      text.textContent = state.gameResult === 'draw'
        ? 'Gelijkspel.'
        : state.gameResult === 'X'
          ? 'Jij hebt de meeste vakjes!'
          : 'Paco heeft de meeste vakjes.';
      const button = documentRef.createElement('button');
      button.type = 'button';
      button.className = 'success';
      button.textContent = 'Terug naar spelletjes';
      button.addEventListener('click', goGames);
      result.append(title, text, button);
      feedback.replaceChildren(result);
    }
  }

  async function load() {
    if (!lessonId || !student) {
      content.textContent = !student ? 'Geen leerling geselecteerd.' : 'Geen les geselecteerd.';
      return;
    }

    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
    if (!lesson) throw new Error('Deze les kon niet worden gevonden.');

    content.insertBefore(createLessonContextField(lesson, { documentRef }), shell.element);

    items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    runtime = createConnectTheDotsRuntime({
      items,
      gradeAnswer: (question, answer, value) => app.grading.gradeAnswer(question, answer, value)
    });
    view = createConnectTheDotsView({ documentRef });
    highScore = await app.gameResults.getHighScore({ gameKey: GAME_KEY, lessonId, student });

    await renderState(runtime.start({ level: 'rookie' }));
  }

  function mount() {
    gameArea = documentRef.createElement('div');
    exercise = documentRef.createElement('div');
    feedback = documentRef.createElement('div');

    shell = createPracticeGameTemplate({
      documentRef,
      className: 'ctd-page-card',
      stats: [
        { label: 'Jij', value: '0' },
        { label: 'Paco', value: '0' },
        { label: 'Vakjes', value: '0' }
      ],
      difficulty: 'rookie',
      onDifficultyChange: level => {
        if (!runtime) return;
        thinkingCancel();
        void renderState(runtime.start({ level }));
      },
      gameArea,
      exercise,
      feedback
    });

    statsElement = shell.statsElement;
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🔵`,
      title: 'Connect the Dots',
      icon: '🔵',
      subtitle: 'Beantwoord de vragen, zet lijnen en pak zoveel mogelijk vakjes.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    content.appendChild(shell.element);

    void load().catch(error => {
      console.error('Connect the Dots load error:', error);
      content.textContent = `Connect the Dots kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`;
    });
  }

  return Object.freeze({ mount, content });
}
