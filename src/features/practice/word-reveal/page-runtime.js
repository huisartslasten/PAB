import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { getStudentLearningProfile } from '../../students/students.js';
import { createWordRevealRuntime } from './runtime.js';
import { createWordRevealView } from './view.js';
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
  const gameShell = documentRef.createElement('main');
  gameShell.className = 'practice-page-card wr-page-card';
  gameShell.innerHTML = `
    <div class="wr-game-head">
      <div class="wr-stats" aria-label="Spelstatistieken">
        <div class="wr-stat"><span>Beurten</span><strong id="wrTurns">0</strong></div>
        <div class="wr-stat"><span>Record</span><strong id="wrRecord">—</strong></div>
        <div class="wr-stat"><span>Vragen</span><strong id="wrProgress">0 van 0</strong></div>
      </div>
    </div>
    <section class="wr-target-panel" aria-label="Geheim doel">
      <span class="wr-target-label">Geheim doel</span>
      <div id="wrTarget" class="wr-target"></div>
    </section>
    <section class="wr-question-panel">
      <span class="wr-question-label">Lesvraag</span>
      <div id="wrQuestionArea"></div>
    </section>
    <section id="wrFeedback" class="wr-feedback-panel" aria-live="polite"></section>`;
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
      view.renderLoading(gameShell, 'Paco bedenkt een mooi doel…');
      const target = await app.aiContent.generateLearningContent({
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
      runtime.startRound(target);
      started = true;
      await render();
    }

    async function render(errorMessage = '') {
      const state = runtime.snapshot();
      view.renderStats(gameShell, state, highScore);
      view.renderTarget(
        gameShell,
        state,
        state.phase === 'reveal-choice'
          ? index => {
              try { runtime.revealLetter(index); void render(); }
              catch (error) { void render(error?.message || 'De letter kon niet worden onthuld.'); }
            }
          : null
      );
      view.renderFeedback(gameShell, state, () => { runtime.continueAfterFeedback(); void render(); });

      if (state.phase === 'finished') {
        await saveScore(state.turns);
        view.renderStats(gameShell, state, highScore);
        view.renderTarget(gameShell, state);
        view.renderFinished(
          gameShell,
          state,
          () => { runtime.restart(state.target); void render(); },
          goGames
        );
        return;
      }

      if (state.phase === 'round-complete') {
        view.renderRoundComplete(gameShell, state, () => { void generateRound().catch(error => render(error?.message || 'De volgende ronde kon niet worden gestart.')); });
        return;
      }

      if (state.phase === 'question' && !state.feedback) {
        view.renderQuestion(
          gameShell,
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
        const node = gameShell.querySelector('#wrQuestionArea');
        if (node) node.replaceChildren();
      }
    }

    if (!items.length) {
      gameShell.querySelector('#wrQuestionArea').textContent = 'Deze les bevat nog geen vragen.';
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
    catch (error) { console.error('Letter Hunt load error:', error); gameShell.textContent = `Letter Hunt kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`; }
  }

  return Object.freeze({ mount, content });
}
