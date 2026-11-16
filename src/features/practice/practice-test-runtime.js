import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPracticePresentation } from '../lessons/practice-presentation.js';
import { createLessonContextField } from '../lessons/lesson-context-view.js';
import { buildViewUrl } from '../../core/view-context.js';
import { escapeHtml } from '../../core/html.js';

export function createPracticeTestRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Practice test runtime requires app.');
  if (!templateMount) throw new TypeError('Practice test runtime requires template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Practice test runtime requires navigation.');

  const student = context?.student || '';
  const content = documentRef.createElement('main');
  content.className = 'practice-page-card';
  content.innerHTML = '<div id="practiceProgress" class="practice-progress"></div><div id="practiceContent" class="practice-content"></div>';

  const goLessonChoice = () => {
    const target = buildViewUrl('lesson-choice.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  const shuffle = items => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  };

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Oefentoets',
      icon: '📝',
      subtitle: 'Beantwoord alle vragen. Je krijgt per vraag feedback, maar de oefentoets telt niet mee als echte toets.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
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
        windowRef: window,
        getLesson: () => ({ ...lesson, practiceMode: 'assessment' }),
        getStudent: () => student,
        db: app.db,
        audioService: app.audio,
        shuffle,
        random: Math.random,
        escapeHtml,
        hideAll: () => {},
        showLessonChoice: goLessonChoice,
        refreshPageSidebars: () => {},
        speechCancel: () => window.speechSynthesis?.cancel(),
        aiCheckAnswers: lesson.ai_check_answers !== false,
        pageElement: content,
        progressElement: documentRef.getElementById('practiceProgress'),
        contentElement: documentRef.getElementById('practiceContent')
      });

      presentation.start(lesson.type || 'words');
    } catch (error) {
      console.error('Practice test load error:', error);
      practiceContent.innerHTML = `<div class="practice-loading">${escapeHtml(error?.message || 'De oefentoets kon niet worden geladen.')}</div>`;
    }
  }

  return Object.freeze({ mount, content });
}
