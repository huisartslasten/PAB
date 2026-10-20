import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';
import { createLearningMaterialEditorPage } from './editor-page.js';
function showMessage(content, message, className = 'message') { content.innerHTML = ''; const box = document.createElement('div'); box.className = className; box.textContent = message; content.appendChild(box); }
export function createLearningMaterialEditorRuntime({ app, templateMount, context = {}, topicId = '', documentRef = document, navigate } = {}) {
  if (!app || !templateMount || typeof navigate !== 'function') throw new TypeError('Learning material editor requires app, template mount and navigation.');
  const content = documentRef.createElement('div'); content.className = 'lesson-learning-editor-page'; const student = context.student || ''; const goManagement = () => navigate(buildViewUrl('management.html', { student, mode: 'management' }));
  mountPacoPageTemplate({ mount: templateMount, backLabel: '← Beheer', backAction: goManagement, greeting: 'PAB beheer ⚙️', title: 'Leerstof maken', icon: '🧠', subtitle: 'Maak leerstof rechtstreeks voor een vak en onderwerp.', navigation: createPacoNavigation({ app, active: 'management', student, viewMode: 'management', includeCreator: true, navigate }), content });
  async function mount() {
    await app.initializeSession(); if (!app.auth.isParent) { showMessage(content, 'Je hebt geen toegang tot leerstofbeheer.', 'message error'); return; } if (!student) { showMessage(content, 'Selecteer eerst een leerling vanuit Beheer.', 'message error'); return; }
    try { let topic = topicId ? await app.learningTopics.getById(topicId) : null; if (!topic && context.subject && context.subvak) topic = await app.learningTopics.ensureTopic({ student, subject: context.subject, subvak: context.subvak }); if (!topic) topic = { id: 0, student, subject: context.subject || '', subvak: context.subvak || '' }; const cards = topic.id ? await app.learningContent.listForTopic(topic.id) : [];
      createLearningMaterialEditorPage({ root: content, topic, cards, learningContent: app.learningContent, documentRef, onSaved: async ({ topic: savedTopic }) => { const resolved = await app.learningTopics.getByContext({ student, subject: savedTopic.subject, subvak: savedTopic.subvak }); if (!resolved) throw new Error('Het leerstofonderwerp kon na opslaan niet worden gevonden.'); const target = buildViewUrl('learning-material.html', { student, mode: 'management', topic_id: String(resolved.id), subject: resolved.subject, saved: '1' }); navigate(target); } });
    } catch (error) { console.error('Learning material editor load error:', error); showMessage(content, error.message || 'De leerstofeditor kon niet worden geladen.', 'message error'); }
  }
  return Object.freeze({ mount });
}
