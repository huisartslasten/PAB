import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { createLessonContextField } from '../../lessons/lesson-context-view.js';
import { mountPracticeGameHelp } from '../practice-game-help.js';
import { createDrop4Runtime, DROP4_AI_LEVELS } from './runtime.js';
import { createDrop4View } from './view.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';

export function createDrop4PageRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('DROP4 runtime requires an app.');
  if (!templateMount) throw new TypeError('DROP4 runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('DROP4 runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createDrop4View({ documentRef, escapeHtml });
  const gameShell = documentRef.createElement('main');
  gameShell.className = 'practice-page-card drop4-page-card';
  gameShell.innerHTML = `<div class="drop4-game-head"><h1 class="drop4-game-title">DROP4</h1><div class="drop4-stats"><div class="drop4-stat"><span>Score</span><strong id="drop4Score">—</strong></div><div class="drop4-stat"><span>Record</span><strong id="drop4Record">— 🥇</strong></div><div class="drop4-stat"><span>Vragen</span><strong id="drop4Progress">0 vragen</strong></div></div></div><div class="drop4-settings"><span class="drop4-setting-label">Paco</span><div id="drop4Level" class="drop4-setting"></div></div><div id="drop4Board" class="drop4-board" aria-label="DROP4 bord"></div><div id="drop4Content" class="drop4-content"></div>`;
  mountPracticeGameHelp(gameShell.querySelector('.drop4-game-head'), {
    documentRef,
    title: 'Zo speel je DROP4',
    paragraphs: [
      'Beantwoord eerst de lesvraag goed. Daarna mag je een steen laten vallen in een kolom.',
      'Vier van jouw stenen op een rij is winst: horizontaal, verticaal of diagonaal. Paco probeert hetzelfde te doen.',
      'Wie begint wordt iedere ronde willekeurig bepaald. Paco denkt even na voordat hij zijn zet doet.',
      'Je score is het aantal van jouw beurten dat je nodig had om te winnen. Lager is beter. Verlies levert geen score op.'
    ]
  });
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

    content.insertBefore(createLessonContextField(lesson, { documentRef }), gameShell);
    const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
    const runtime = createDrop4Runtime({ items, gradeAnswer: (question, answer, value) => app.grading.gradeAnswer(question, answer, value) });

    let bestScore = await app.gameResults.getHighScore({ gameKey: 'drop4', lessonId, student });
    let cancelPacoTurn = () => {};

    async function persistScore(score) {
      if (score == null) return;
      const normalizedScore = Math.max(1, Math.floor(Number(score) || 0));
      if (bestScore != null && normalizedScore >= bestScore) return;
      await app.gameResults.saveResult({ gameKey: 'drop4', lessonId, student, score: normalizedScore });
      bestScore = normalizedScore;
    }

    async function render(errorMessage = '') {
      cancelPacoTurn();
      cancelPacoTurn = () => {};
      const state = runtime.snapshot();
      const enriched = { ...state, bestScore };
      view.renderStats(enriched);
      view.renderBoard(enriched, column => {
        try { runtime.selectColumn(column); void render(); } catch (error) { void render(error?.message || 'Deze kolom kan nu niet worden gekozen.'); }
      });
      view.renderSettings(enriched, DROP4_AI_LEVELS, value => { runtime.start({ level: value }); void render(); });

      if (enriched.phase === 'finished') {
        await persistScore(enriched.score);
        const finalState = { ...runtime.snapshot(), bestScore };
        view.renderStats(finalState);
        view.renderBoard(finalState, () => {});
        view.renderGameResult(finalState, () => { runtime.start({ level: finalState.aiLevel }); void render(); }, goGames);
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
          try { runtime.playPacoMove(); } catch (error) { console.error('DROP4 Paco move error:', error); } finally { void render(); }
        });
        return;
      }

      if (enriched.phase === 'choosing') {
        const contentNode = documentRef.getElementById('drop4Content');
        if (contentNode) contentNode.innerHTML = `<div class="drop4-turn">${enriched.turn === 'X' ? 'Kies een kolom. Eerst goed antwoorden, dan valt jouw steen.' : 'Paco is aan de beurt.'}</div>`;
      }
    }

    runtime.start({ level: 'rookie' });
    await render();
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Spelletjes',
      backAction: goGames,
      greeting: `Hoi ${student}! 🐶`,
      title: 'DROP4',
      icon: '🔴',
      subtitle: 'Beantwoord de lesvragen en probeer vier op een rij te krijgen.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    try { await load(); } catch (error) { console.error('DROP4 load error:', error); gameShell.textContent = `DROP4 kon niet worden geladen: ${error?.message || 'Onbekende fout.'}`; }
  }

  return Object.freeze({ mount, content });
}
