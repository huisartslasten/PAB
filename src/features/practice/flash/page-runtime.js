import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { createPracticeGameTemplate } from '../practice-game-template.js';
import { createFlashRuntime } from './runtime.js';
import { createFlashView } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';

export function createFlashPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Flash runtime requires an app.');
  if (!templateMount) throw new TypeError('Flash runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Flash runtime requires a navigation owner.');
  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createFlashView({ documentRef, escapeHtml });
  const gameArea = documentRef.createElement('div');
  gameArea.innerHTML = '<div id="flashProgress" class="practice-progress"></div><div id="flashContent" class="practice-content flash-content"></div>';
  const gameTemplate = createPracticeGameTemplate({
    documentRef,
    className: 'flash-game-template',
    showDifficulty: false,
    stats: [
      { id: 'score', label: 'Score', value: '0' },
      { id: 'maximum', label: 'Maximum', value: '0' },
      { id: 'highScore', label: 'High score', value: '0' }
    ],
    gameArea
  });
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
    const runtime = createFlashRuntime({ items });
    let highScore = await app.gameResults.getHighScore({ gameKey: 'flash_question', lessonId, student });
    highScore = highScore == null ? 0 : highScore;
    let timingMode = 'manual';
    let timerId = null;
    let timerIntervalId = null;

    function clearQuestionTimer() {
      if (timerId !== null) {
        documentRef.defaultView?.clearTimeout?.(timerId);
        timerId = null;
      }
      if (timerIntervalId !== null) {
        documentRef.defaultView?.clearInterval?.(timerIntervalId);
        timerIntervalId = null;
      }
    }

    async function persistScore(score) {
      const normalizedScore = Math.max(0, Math.floor(Number(score) || 0));
      if (normalizedScore <= highScore) return;
      await app.gameResults.saveResult({ gameKey: 'flash_question', lessonId, student, score: normalizedScore });
      highScore = normalizedScore;
    }

    function renderState({ remainingSeconds = null } = {}) {
      const state = runtime.snapshot();
      clearQuestionTimer();
      if (state.phase === 'finished') return persistScore(state.score).then(() => view.renderFinished(state, highScore, restart, goGames));
      if (state.phase === 'result') {
        view.renderResult(state, highScore, () => {
          runtime.continueGame();
          renderState();
        });
        return Promise.resolve();
      }
      view.renderQuestion(state, answer => {
        clearQuestionTimer();
        runtime.submitAnswer(answer);
        renderState();
      }, highScore, {
        timingMode,
        remainingSeconds,
        onTimingModeChange: nextValue => {
          timingMode = nextValue;
          renderState();
        }
      });
      if (timingMode !== 'manual') {
        let secondsLeft = Number(timingMode);
        const updateTimer = () => {
          const timer = gameTemplate.element.querySelector('.flash-timer');
          if (timer) timer.textContent = `${secondsLeft} ${secondsLeft === 1 ? 'seconde' : 'seconden'}`;
        };
        updateTimer();
        timerIntervalId = documentRef.defaultView?.setInterval?.(() => {
          secondsLeft -= 1;
          if (secondsLeft > 0) updateTimer();
        }, 1000) ?? setInterval(() => {
          secondsLeft -= 1;
          if (secondsLeft > 0) updateTimer();
        }, 1000);
        timerId = documentRef.defaultView?.setTimeout?.(() => {
          clearQuestionTimer();
          runtime.submitAnswer('');
          renderState();
        }, secondsLeft * 1000) ?? setTimeout(() => {
          clearQuestionTimer();
          runtime.submitAnswer('');
          renderState();
        }, secondsLeft * 1000);
      }
      return Promise.resolve();
    }

    function restart() {
      clearQuestionTimer();
      runtime.start();
      renderState();
    }

    restart();
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Flash',
      icon: '⚡',
      subtitle: 'Kies snel het juiste antwoord en oefen alle vragen.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    try {
      await load();
    } catch (error) {
      console.error('Flash load error:', error);
      const node = documentRef.createElement('div');
      node.className = 'practice-content';
      node.innerHTML = `<strong>Flash kon niet worden geladen.</strong><p class="small">${escapeHtml(error?.message || 'Onbekende fout.')}</p>`;
      gameTemplate.element.replaceChildren(node);
    }
  }

  return Object.freeze({ mount, content });
}
