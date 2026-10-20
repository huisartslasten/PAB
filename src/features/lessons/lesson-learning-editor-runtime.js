import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createLessonLearningEditorPage } from './lesson-learning-editor-page.js';

function showMessage(content, message, className = 'message') {
  content.innerHTML = '';
  const box = document.createElement('div');
  box.className = className;
  box.textContent = message;
  content.appendChild(box);
}

export function createLessonLearningEditorRuntime({ app, templateMount, context = {}, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app || !templateMount || typeof navigate !== 'function' || !lessonId) throw new TypeError('Learning editor runtime requires app, template mount, navigation and lesson id.');
  const content = documentRef.createElement('div');
  content.className = 'lesson-learning-editor-page';
  const student = context.student || '';
  const viewMode = context.mode || 'management';
  const goLessons = () => navigate(buildViewUrl('lessons.html', { student, mode: 'management' }));
  mountPacoPageTemplate({ mount: templateMount, backLabel: '← Lessen', backAction: goLessons, greeting: 'PAB beheer ⚙️', title: 'Leerstof bewerken', icon: '🧠', subtitle: 'Maak schermformaat leerkaarten voor deze les.', navigation: createPacoNavigation({ app, active: 'management', student, viewMode, includeCreator: true, navigate }), content });

  async function mount() {
    await app.initializeSession();
    if (!app.auth.isParent) { showMessage(content, 'Je hebt geen toegang tot leerstofbeheer.', 'message error'); return; }
    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId)) || null;
    if (!lesson) { showMessage(content, 'Deze les kon niet worden gevonden.', 'message error'); return; }
    const cards = await app.learningContent.listForLesson(lesson.id);
    createLessonLearningEditorPage({
      root: content,
      lesson,
      cards,
      learningContent: app.learningContent,
      documentRef,
      onSaved: async () => {
        const target = buildViewUrl('lesson-learning.html', { lesson_id: lesson.id, student, mode: viewMode, saved: '1' });
        navigate(target);
      }
    });
  }
  return Object.freeze({ mount });
}
