import { mountPacoPageTemplate } from '../../../components/page-template.js';
import { createPacoNavigation } from '../../../components/page-navigation.js';
import { buildViewUrl } from '../../../core/view-context.js';
import { escapeHtml } from '../../../core/html.js';
import { createMillionaireRuntime } from './runtime.js';
import { createMillionaireView } from './view.js';

export async function createMillionairePageRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Millionaire runtime requires an app.');
  if (!templateMount) throw new TypeError('Millionaire runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Millionaire runtime requires navigation.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const view = createMillionaireView({ documentRef });

  const goDashboard = () => navigate(buildViewUrl('dashboard.html', { student, mode: context?.mode }));

  mountPacoPageTemplate({
    mount: templateMount,
    backLabel: '← Challenges',
    backAction: goDashboard,
    greeting: `Hoi ${student}! 🐶`,
    title: 'Millionaire',
    icon: '🏆',
    subtitle: 'De eerste PacoGO Challenge.',
    navigation: createPacoNavigation({ app, active: 'dashboard', student, viewMode: context?.mode, navigate }),
    content
  });

  if (!student) {
    content.innerHTML = '<div class="millionaire-question-card">Geen leerling geselecteerd.</div>';
    return Object.freeze({ mount: async () => {}, content });
  }

  try {
    const records = await app.loadLessons();
    const lessons = app.mapLessons(records);
    const passedLessonIds = await app.practiceResults.listPassedLessonIds(student);
    const eligibleLessons = lessons.filter(lesson =>
      !lesson.archived && !lesson.deleted && passedLessonIds.includes(Number(lesson.id))
    );

    if (!eligibleLessons.length) {
      content.innerHTML = '<div class="millionaire-question-card"><h2>Challenge nog niet vrijgespeeld</h2><p>Rond eerst een relevante oefentoets succesvol af. Daarna verschijnt Millionaire op je dashboard.</p></div>';
      return Object.freeze({ mount: async () => {}, content });
    }

    const questions = eligibleLessons.flatMap(lesson => {
      const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : Array.isArray(lesson.items) ? lesson.items : [];
      return items
        .filter(item => String(item?.question ?? '').trim() && String(item?.answer ?? '').trim())
        .map(item => ({
          ...item,
          lessonId: lesson.id,
          subject: lesson.subject || '',
          subvak: lesson.subvak || '',
          title: lesson.title || '',
          type: lesson.type || ''
        }));
    });

    if (!questions.length) {
      content.innerHTML = '<div class="millionaire-question-card"><h2>Geen vragen beschikbaar</h2><p>De vrijgegeven leerstof bevat momenteel geen bruikbare vragen voor deze Challenge.</p></div>';
      return Object.freeze({ mount: async () => {}, content });
    }

    const runtime = createMillionaireRuntime({ questions, distractorService: app.aiContent });

    async function render() {
      const state = runtime.snapshot();
      content.replaceChildren(view.render(state, {
        onAnswer: async answer => { runtime.choose(answer); if (!runtime.snapshot().finished) await runtime.next(); await render(); },
        onFiftyFifty: async () => { runtime.useFiftyFifty(); await render(); },
        onAskSomeone: async () => { runtime.useAskSomeone(); await render(); },
        onAskAudience: async () => { runtime.useAskAudience(); await render(); },
        onRestart: async () => { runtime.start(); await runtime.next(); await render(); },
        onBack: goDashboard
      }));
    }

    runtime.start();
    await runtime.next();
    await render();
  } catch (error) {
    console.error('Millionaire load error:', error);
    content.innerHTML = `<div class="millionaire-question-card"><h2>Millionaire kon niet worden geladen</h2><p>${escapeHtml(error?.message || 'Onbekende fout.')}</p></div>`;
  }

  return Object.freeze({ mount: async () => {}, content });
}
