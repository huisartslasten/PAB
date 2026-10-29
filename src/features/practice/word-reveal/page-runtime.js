import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { getStudentLearningProfile } from '../../../core/student-registry.js';
import { createWordRevealRuntime } from './runtime.js';
import { createWordRevealView } from './view.js';
import { createPracticeGameTemplate } from '../practice-game-template.js';
import { buildViewUrl } from '../../../core/view-context.js';

const GAME_KEY = 'word_reveal';

function targetConstraints(remainingCount, level) {
  const maxCharacters = level === 'beginner'
    ? Math.min(24, Math.max(6, remainingCount * 3))
    : Math.min(42, Math.max(8, remainingCount * 4));
  return {
    remainingQuestionCount: remainingCount,
    maxCharacters,
    targetForms: remainingCount <= 2 ? ['word', 'sentence'] : ['word', 'sentence', 'saying']
  };
}

export function createWordRevealPageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Word Reveal runtime requires an app.');
  if (!templateMount) throw new TypeError('Word Reveal runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Word Reveal runtime requires a navigation owner.');

  const student = context?.student || '';
  const profile = getStudentLearningProfile(student) || { id: student, level: 'beginner' };
  const content = documentRef.createElement('div');
  const view = createWordRevealView({ documentRef });

  const gameArea = documentRef.createElement('div');
  const targetPanel = documentRef.createElement('section');
  targetPanel.className = 'wr-target-panel';
  targetPanel.setAttribute('aria-label', 'Geheim doel');
  const targetLabel = documentRef.createElement('span');
  targetLabel.className = 'wr-target-label';
  targetLabel.textContent = 'Geheim doel';
  const target = documentRef.createElement('div');
  target.id = 'wrTarget';
  target.className = 'wr-target';
  targetPanel.append(targetLabel, target);
  gameArea.appendChild(targetPanel);

  const exercise = documentRef.createElement('div');
  const questionPanel = documentRef.createElement('section');
  questionPanel.className = 'wr-question-panel';
  const questionLabel = documentRef.createElement('span');
  questionLabel.className = 'wr-question-label';
  questionLabel.textContent = 'Lesvraag';
  const questionArea = documentRef.createElement('div');
  questionArea.id = 'wrQuestionArea';
  questionPanel.append(questionLabel, questionArea);
  exercise.appendChild(questionPanel);

  const feedback = documentRef.createElement('section');
  feedback.id = 'wrFeedback';
  feedback.className = 'wr-feedback-panel';
  feedback.setAttribute('aria-live', 'polite');

  const gameTemplate = createPracticeGameTemplate({
    documentRef,
    className: 'wr-game-template',
    stats: [
      { id: 'score', label: 'Beurten', value: '0' },
      { id: 'record', label: 'Record', value: '—' },
      { id: 'progress', label: 'Vragen', value: '0 van 0' }
    ],
    showDifficulty: false,
    gameArea,
    exercise,
    feedback
  });
  content.appendChild(gameTemplate.element);

  const goGames = () => {
    const targetUrl = buildViewUrl('games.html', { student, mode: context?.mode });
    if (lessonId) targetUrl.searchParams.set('lesson_id', lessonId);
    return navigate(targetUrl);
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

    const contextField = createLessonContextField(lesson, { documentRef });
    content.insertBefore(contextField, gameTemplate.element);

    const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    const runtime = createWordRevealRuntime({
      items,
      gradeAnswer: (question, answer, value) => app.grading.gradeAnswer(question, answer, value)
    });

    let highScore = await app.gameResults.getHighScore({ gameKey: GAME_KEY, lessonId, student });
    let started = false;

    async function saveScore(score) {
      const normalized = Math.max(0, Math.floor(Number(score) || 0));
      if (highScore != null && normalized >= highScore) return;
      await app.gameResults.saveResult({ gameKey: GAME_KEY, lessonId, student, score: normalized });
      highScore = normalized;
    }

    async function generateRound() {
      const state = runtime.snapshot();
      if (!state.remainingCount) return;
      view.renderLoading(gameTemplate.element, 'Paco bedenkt een mooi doel…');
      const generatedTarget = await app.aiContent.generateLearningContent({
        contentType: 'practice_target',
        locale: 'nl-NL',
        learner: { id: profile.id, name: student, level: profile.level },
        lesson: {
          id: lesson.id,
          title: lesson.title,
          subject: lesson.subject,
          subvak: lesson.subvak,
          questions: items.map(item => ({ question: item.question, answer: item.answer }))
        },
        constraints: targetConstraints(state.remainingCount, profile.level)
      });
      runtime.startRound(generatedTarget);
      started = true;
      await render();
    }

    async function render(errorMessage = '') {
      const state = runtime.snapshot();
      view.renderStats(gameTemplate.element, state, highScore);
      view.renderTarget(
        gameTemplate.element,
        state,
        state.phase === 'reveal-choice'
          ? index => {
              try { runtime.revealLetter(index); void render(); }
              catch (error) { void render(error?.message || 'De letter kon niet worden onthuld.'); }
            }
          : null
      );
      view.renderFeedback(gameTemplate.element, state, () => { runtime.continueAfterFeedback(); void render(); });

      if (state.phase === 'finished') {
        await saveScore(state.turns);
        view.renderStats(gameTemplate.element, state, highScore);
        view.renderTarget(gameTemplate.element, state);
        view.renderFinished(
          gameTemplate.element,
          state,
          () => { runtime.restart(state.target); void render(); },
          goGames
        );
        return;
      }

      if (state.phase === 'round-complete') {
        view.renderRoundComplete(gameTemplate.element, state, () => { void generateRound().catch(error => render(error?.message || 'De volgende ronde kon niet worden gestart.')); });
        return;
      }

      if (state.phase === 'question' && !state.feedback) {
        view.renderQuestion(
          gameTemplate.element,
          state,
          async answer => {
            try { await runtime.submitAnswer(answer); await render(); }
            catch (error) { await render(error?.message || 'Het antwoord kon niet worden verwerkt.'); }
          },
          value => {
            try { runtime.guessSolution(value); void render(); }
            catch (error) { void render(error?.message || 'De oplossing kon nu niet worden geraden.'); }
          },
          errorMessage
        );
        return;
      }

      if (state.phase === 'question' && state.feedback) {
        const node = gameTemplate.element.querySelector('#wrQuestionArea');
        if (node) node.replaceChildren();
      }
    }

    if (!items.length) {
      gameTemplate.element.querySelector('#wrQuestionArea').textContent = 'Deze les bevat nog geen vragen.';
      return;
    }

    if (!started) await generateRound();
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Letter Hunt',
      icon: '🐶',
      subtitle: 'Beantwoord de vragen uit deze les en onthul het geheime doel.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    try { await load(); }
    catch (error) { console.error('Letter Hunt load error:', error); gameTemplate.element.textContent = `Letter Hunt kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`; }
  }

  return Object.freeze({ mount, content });
}
