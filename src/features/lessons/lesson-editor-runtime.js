import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createLessonEditorApplication } from './lesson-editor-application.js';
import { createLessonEditorPage } from './lesson-editor-page.js';

function showMessage(content, message, className = 'message') {
  content.innerHTML = '';
  const box = document.createElement('div');
  box.className = className;
  box.textContent = message;
  content.appendChild(box);
}

export function createLessonEditorRuntime({
  app,
  templateMount,
  context = {},
  lessonId = '',
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Lesson editor runtime requires an app.');
  if (!templateMount) throw new TypeError('Lesson editor runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Lesson editor runtime requires central navigation.');

  const content = documentRef.createElement('div');
  content.className = 'lesson-editor-page';
  const student = context.student || '';
  const viewMode = context.mode || 'student';
  const editorApp = createLessonEditorApplication({
    lessonService: app.lessons,
    storage: globalThis.localStorage,
    initializeSession: () => app.initializeSession(),
    isParent: () => app.auth.isParent,
    refreshLessons: () => app.loadLessons()
  });

  const goManagement = () => navigate(buildViewUrl('management.html', { student, mode: 'management' }).toString());

  mountPacoPageTemplate({
    mount: templateMount,
    backLabel: '← Beheer',
    backAction: goManagement,
    greeting: 'PacoGO beheer ⚙️',
    title: lessonId ? 'Les bewerken' : 'Nieuwe les',
    icon: '📚',
    subtitle: 'Maak of bewerk een les met de bestaande lesvormen en velden.',
    navigation: createPacoNavigation({
      app,
      active: 'management',
      student,
      viewMode,
      includeCreator: true,
      navigate
    }),
    content
  });

  async function mount() {
    await app.initializeSession();
    if (!app.auth.isParent) {
      showMessage(content, 'Je hebt geen toegang tot lesbeheer.', 'message error');
      return;
    }

    let lesson = null;
    if (lessonId) {
      const records = await app.loadLessons();
      lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId)) || null;
      if (!lesson) {
        showMessage(content, 'Deze les kon niet worden gevonden.', 'message error');
        return;
      }
      const calendarEntry = editorApp.calendar.getAll().find(item => Number(item.lessonId) === Number(lesson.id) && item.student === lesson.student);
      lesson = { ...lesson, testDate: calendarEntry?.date || '' };
    }

    createLessonEditorPage({
      root: content,
      runtime: editorApp.editor,
      initialLesson: lesson,
      student: student || lesson?.student || ''
    });
  }

  return Object.freeze({ mount });
}
