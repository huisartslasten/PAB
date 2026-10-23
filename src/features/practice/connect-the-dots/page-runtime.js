import { mountPacoPageTemplate, createPacoDropdown } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createPracticeGameTemplate, PRACTICE_PACO_THINKING_DELAY_MS, schedulePacoTurn } from '../practice-game-template.js';
import { createConnectTheDotsRuntime } from './runtime.js';
import { createConnectTheDotsView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';

const GAME_KEY = 'connect-the-dots';

export function createConnectTheDotsPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app || !templateMount || typeof navigate !== 'function') throw new TypeError('Connect the Dots runtime requires app, template mount and navigation.');
  const student = context?.student || '';
  const content = documentRef.createElement('div');
  let runtime = null;
  let view = null;
  let shell = null;
  let gameArea = null;
  let exercise = null;
  let feedback = null;
  let thinkingCancel = null;
  let highScore = null;
  let lesson = null;
  let items = [];
  let errorMessage = '';

  const goGames = () => navigate(buildViewUrl('games.html', { student, mode: context?.mode, lesson_id: lessonId }));

  function statsFrom(state) {
    return [
      { label: 'Jij', value: String(state.playerBoxes) },
      { label: 'Paco', value: String(state.pacoBoxes) },
      { label: 'Vakjes', value: String(state.totalBoxes) }
    ];
  }

  async function saveScore(state) {
    if (state.gameResult !== 'X') return;
    const score = Math.max(0, Math.floor(Number(state.playerBoxes) || 0));
    if (highScore != null && score <= highScore) return;
    await app.gameResults.saveResult({ gameKey: GAME_KEY, lessonId, student, score });
    highScore = score;
  }

  function setThinking(state) {
    gameArea.replaceChildren();
    const panel = documentRef.createElement('div');
    panel.className = 'ctd-thinking';
    panel.textContent = 'Paco denkt na…';
    gameArea.appendChild(panel);
    feedback.replaceChildren();
    thinkingCancel?.();
    thinkingCancel = schedulePacoTurn({ onTurn: async () => { thinkingCancel = null; const next = runtime.playPacoMove(); await renderState(next); }, delayMs: PRACTICE_PACO_THINKING_DELAY_MS });
  }

  async function renderState(state) {
    shell.querySelector('.practice-game-stats').replaceChildren(...statsFrom(state).map(stat => {
      const node = documentRef.createElement('div'); node.className = 'practice-game-stat';
      const label = documentRef.createElement('span'); label.textContent = stat.label;
      const value = documentRef.createElement('strong'); value.textContent = stat.value;
      node.append(label, value); return node;
    }));

    if (state.phase === 'paco') { setThinking(state); return; }
    thinkingCancel?.(); thinkingCancel = null;
    if (state.phase === 'question') {
      view.renderQuestion(exercise, state, async answer => { try { errorMessage = ''; await renderState(await runtime.submitAnswer(answer)); } catch (error) { errorMessage = error?.message || 'Het antwoord kon niet worden verwerkt.'; await renderState(runtime.snapshot()); } }, errorMessage);
      feedback.replaceChildren();
      return;
    }
    view.render(gameArea, state, { onEdge: async key => { try { errorMessage = ''; await renderState(runtime.selectEdge(key)); } catch (error) { errorMessage = error?.message || 'Deze lijn kan nu niet worden gekozen.'; await renderState(runtime.snapshot()); } } });
    if (state.lastResult && state.phase !== 'choosing') view.renderFeedback(feedback, state, () => renderState(runtime.snapshot())); else feedback.replaceChildren();
    if (state.phase === 'finished') {
      await saveScore(state);
      const result = documentRef.createElement('div'); result.className = 'ctd-finished';
      result.innerHTML = '<strong>Potje afgelopen!</strong>';
      const text = documentRef.createElement('span'); text.textContent = state.gameResult === 'draw' ? 'Gelijkspel.' : state.gameResult === 'X' ? 'Jij hebt de meeste vakjes!' : 'Paco heeft de meeste vakjes.';
      result.appendChild(text);
      const button = documentRef.createElement('button'); button.className = 'success'; button.textContent = 'Terug naar spelletjes'; button.addEventListener('click', goGames);
      result.appendChild(button); feedback.replaceChildren(result);
    }
  }

  async function load() {
    if (!lessonId || !student) { content.textContent = !student ? 'Geen leerling geselecteerd.' : 'Geen les geselecteerd.'; return; }
    const records = await app.loadLessons();
    lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
    if (!lesson) throw new Error('Deze les kon niet worden gevonden.');
    items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    runtime = createConnectTheDotsRuntime({ items, gradeAnswer: (question, answer, value) => app.grading.gradeAnswer(question, answer, value) });
    view = createConnectTheDotsView({ documentRef });
    highScore = await app.gameResults.getHighScore({ gameKey: GAME_KEY, lessonId, student });
    const state = runtime.start({ level: 'rookie' });
    await renderState(state);
  }

  async function mount() {
    const contextField = lessonId ? null : null;
    const shellContent = documentRef.createElement('div');
    shellContent.className = 'ctd-content';
    gameArea = documentRef.createElement('div'); gameArea.className = 'ctd-game-area';
    exercise = documentRef.createElement('div'); exercise.className = 'ctd-exercise';
    feedback = documentRef.createElement('div'); feedback.className = 'ctd-feedback-area';
    shellContent.append(gameArea, exercise, feedback);
    const controls = documentRef.createElement('div'); controls.className = 'ctd-controls';
    const shell = createPracticeGameTemplate({ documentRef, className: 'ctd-page-card', stats: [{ label: 'Jij', value: '0' }, { label: 'Paco', value: '0' }, { label: 'Vakjes', value: '0' }], difficulty: 'rookie', onDifficultyChange: level => { const state = runtime.start({ level }); void renderState(state); }, controls });
    shell.element.querySelector('.practice-game-main').replaceChildren(gameArea, exercise, feedback);
    content.appendChild(shell.element);
    window.setTimeout(() => { void load().catch(error => { console.error('Connect the Dots load error:', error); content.textContent = `Connect the Dots kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`; }); }, 0);
    mountPacoPageTemplate({ mount: templateMount, backLabel: '← Spelletjes', backAction: goGames, greeting: `Hoi ${student}! 🔵`, title: 'Connect the Dots', icon: '🔵', subtitle: 'Beantwoord de vragen, zet lijnen en pak zoveel mogelijk vakjes.', navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }), content });
  }

  return Object.freeze({ mount, content });
}
