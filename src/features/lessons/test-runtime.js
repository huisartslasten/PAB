import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createProfessionalPlayerBridge } from './player-runtime-bootstrap.js';
import { createLessonContextField } from './lesson-context-view.js';
import { buildViewUrl } from '../../core/view-context.js';
import { escapeHtml } from '../../core/html.js';

export function createTestRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Test runtime requires an app.');
  if (!templateMount) throw new TypeError('Test runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Test runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const testScreen = documentRef.createElement('main');
  testScreen.className = 'practice-page-card';
  testScreen.innerHTML = '<div id="test" class="hidden"><div id="testProgress" class="practice-progress"></div><div id="testContent" class="practice-content"></div></div><div id="result" class="test-result-card hidden"><div class="test-result-content"><h2 id="resultTitle"></h2><div id="resultScore" class="result-score"></div><div id="resultDetails" class="result-details"></div><div class="result-actions"><button id="retryButton" class="primary" type="button">Nog een keer</button><button id="backButton" class="secondary" type="button">← Leskeuze</button></div></div></div>';
  content.appendChild(testScreen);

  const goChoice = () => {
    const target = buildViewUrl('lesson-choice.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };
  const hideAll = () => {
    testScreen.querySelector('#test')?.classList.add('hidden');
    testScreen.querySelector('#result')?.classList.add('hidden');
  };
  const languageFor = lesson => {
    const subject = String(lesson?.subject || '').toLowerCase();
    if (subject.includes('engels') || subject.includes('english')) return 'en';
    if (subject.includes('spaans') || subject.includes('spanish')) return 'es';
    if (subject.includes('frans') || subject.includes('french')) return 'fr';
    if (subject.includes('duits') || subject.includes('german')) return 'de';
    if (subject.includes('portugees') || subject.includes('portuguese')) return 'pt';
    return 'nl';
  };

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Leskeuze',
      backAction: goChoice,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Toets',
      icon: '📝',
      subtitle: 'Beantwoord alle vragen. De uitslag komt aan het einde.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });

    try {
      if (!lessonId || !student) throw new Error('Geen leerling of les geselecteerd.');
      await app.initializeSession();
      const records = await app.loadLessons();
      const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
      if (!lesson) throw new Error('Deze les kon niet worden gevonden.');
      const contextField = createLessonContextField(lesson, { documentRef });
      content.insertBefore(contextField, testScreen);
      const bridge = createProfessionalPlayerBridge({
        getLesson: () => lesson,
        getStudent: () => student,
        db: app.db,
        audioService: app.audio,
        documentRef,
        hideAll,
        showLessonChoice: goChoice,
        goBack: goChoice,
        clearActivity: () => {},
        escapeHtml,
        speakAiText: (text, statusId) => app.audio.speak(text, {
          language: languageFor(lesson),
          onStatus: status => {
            const node = documentRef.getElementById(statusId);
            if (node) node.textContent = status;
          }
        }),
        stopAiAudio: () => app.audio.stop(),
        gradeAnswer: app.grading.gradeAnswer
      });
      documentRef.defaultView.submitTest = () => bridge.submitTest({ type: lesson.type });
      documentRef.defaultView.speakTest = () => bridge.speakTest();
      documentRef.getElementById('retryButton').addEventListener('click', () => bridge.entry?.retry?.());
      documentRef.getElementById('backButton').addEventListener('click', goChoice);
      bridge.startTest({ type: lesson.type });
    } catch (error) {
      console.error('Test load error:', error);
      const test = testScreen.querySelector('#test');
      const testContent = testScreen.querySelector('#testContent');
      test?.classList.remove('hidden');
      if (testContent) {
        testContent.innerHTML = `<strong>De toets kon niet worden geladen.</strong><p class="small">${escapeHtml(error?.message || 'Onbekende fout.')}</p><button class="big" id="loadBack" type="button">← Leskeuze</button>`;
        testContent.querySelector('#loadBack')?.addEventListener('click', goChoice);
      }
    }
  }

  return Object.freeze({ mount, content });
}
