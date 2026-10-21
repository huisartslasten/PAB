import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl, getViewContext } from '../../core/view-context.js';
import { listStudents } from '../students/students.js';
import { createLearningMaterialEditorPage } from './editor-page.js';

function showMessage(content, message, className = 'message') {
  content.innerHTML = '';
  const box = document.createElement('div');
  box.className = className;
  box.textContent = message;
  content.appendChild(box);
}

export function createLearningMaterialEditorRuntime({ app, templateMount, context = {}, topicId = '', documentRef = document, navigate } = {}) {
  if (!app || !templateMount || typeof navigate !== 'function') throw new TypeError('Learning material editor requires app, template mount and navigation.');
  const content = documentRef.createElement('div');
  content.className = 'lesson-learning-editor-page';
  const currentView = getViewContext();
  const initialStudent = context.student || currentView.student || '';
  const viewMode = context.mode || currentView.mode || 'management';

  mountPacoPageTemplate({
    mount: templateMount,
    greeting: 'PAB beheer ⚙️',
    title: 'Leerstof maken',
    icon: '🧠',
    subtitle: 'Maak leerstof rechtstreeks voor een leerling, vak en onderwerp.',
    navigation: createPacoNavigation({ app, active: 'management', student: initialStudent, viewMode: 'management', includeCreator: true, navigate }),
    content
  });

  async function mount() {
    await app.initializeSession();
    if (!app.auth.isParent) {
      showMessage(content, 'Je hebt geen toegang tot leerstofbeheer.', 'message error');
      return;
    }

    try {
      const topic = topicId
        ? await app.learningTopics.getById(topicId)
        : (initialStudent && context.subject
          ? await app.learningTopics.getByContext({ student: initialStudent, subject: context.subject, subvak: context.subvak || '' })
          : null);
      const resolvedTopic = topic || {
        id: 0,
        student: initialStudent,
        subject: context.subject || '',
        subvak: context.subvak || ''
      };
      const cards = resolvedTopic.id ? await app.learningContent.listForTopic(resolvedTopic.id) : [];
      createLearningMaterialEditorPage({
        root: content,
        topic: resolvedTopic,
        cards,
        students: listStudents(),
        learningContent: app.learningContent,
        documentRef,
        onSaved: async ({ topic: savedTopic }) => {
          const target = buildViewUrl('learning-material.html', {
            topic_id: savedTopic.id,
            student: savedTopic.student,
            subject: savedTopic.subject,
            subvak: savedTopic.subvak,
            mode: viewMode,
            saved: '1'
          });
          navigate(target);
        }
      });
    } catch (error) {
      console.error('Learning material editor load error:', error);
      showMessage(content, error.message || 'De leerstofeditor kon niet worden geladen.', 'message error');
    }
  }

  return Object.freeze({ mount });
}
