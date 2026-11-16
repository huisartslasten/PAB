import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPracticePresentation } from '../lessons/practice-presentation.js';
import { createLessonContextField } from '../lessons/lesson-context-view.js';
import { buildViewUrl } from '../../core/view-context.js';
import { escapeHtml } from '../../core/html.js';

export function createLessonPracticeRuntime({ app, templateMount, context, lessonId = '', contentKind = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Lesson practice runtime requires app.');
  if (!templateMount) throw new TypeError('Lesson practice runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Lesson practice runtime requires navigation.');

  const student = context?.student || '';
  const content = documentRef.createElement('main');
  content.className = 'practice-page-card';
  content.innerHTML = '<div id="practiceProgress" class="practice-progress"></div><div id="practiceContent" class="practice-content"></div>';

  const goPractice = () => {
    const target = buildViewUrl('oefenen.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Oefenen',
      backAction: goPractice,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Dictee',
      icon: '✏️',
      subtitle: contentKind === 'sentences' ? 'Luister naar de zin en schrijf de hele zin op.' : 'Luister naar het woord en schrijf het op.',
      navigation: createPacoNavigation({ app, active: 'practice', student, viewMode: context?.mode, navigate }),
      content
    });

    const practiceContent = documentRef.getElementById('practiceContent');
    if (!lessonId || !student) {
      practiceContent.innerHTML = '<div class="practice-loading">Geen leerling of les geselecteerd.</div>';
      return;
    }

    try {
      const records = await app.loadLessons();
      const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
      if (!lesson) throw new Error('Deze les kon niet worden gevonden.');

      const contextField = createLessonContextField(lesson, { documentRef });
      content.parentElement?.insertBefore(contextField, content);

      const presentation = createPracticePresentation({
        documentRef,
        windowRef: documentRef.defaultView || window,
        getLesson: () => ({ ...lesson, practiceMode: 'practice' }),
        getStudent: () => student,
        db: app.db,
        masteryService: app.mastery,
        audioService: app.audio,
        escapeHtml,
        hideAll: () => {},
        showLessonChoice: goPractice,
        refreshPageSidebars: () => {},
        speechCancel: () => documentRef.defaultView?.speechSynthesis?.cancel?.(),
        aiCheckAnswers: false,
        pageElement: content,
        progressElement: documentRef.getElementById('practiceProgress'),
        contentElement: documentRef.getElementById('practiceContent')
      });

      presentation.start('dictation', contentKind);
    } catch (error) {
      console.error('Lesson practice load error:', error);
      practiceContent.innerHTML = `<div class="practice-loading">${escapeHtml(error?.message || 'De oefening kon niet worden geladen.')}</div>`;
    }
  }

  return Object.freeze({ mount, content });
}
