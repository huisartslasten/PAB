import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';

function escapeHtml(value) { return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
function renderDocument(model) { return (Array.isArray(model?.elements) ? model.elements : []).map(element => {
  if (element?.type === 'image' && element.media_id && element.image?.url) { const width = Math.min(100, Math.max(20, Number(element.width) || 100)); return `<img class="learning-view-image" src="${escapeHtml(element.image.url)}" alt="${escapeHtml(element.image.original_name || 'Afbeelding')}" style="width:${width}%">`; }
  return element?.type === 'text' ? element.html || '' : '';
}).join(''); }
function showMessage(content, message, className = 'message') { content.innerHTML = `<div class="${className}">${escapeHtml(message)}</div>`; }

export function createLessonLearningViewRuntime({ app, templateMount, context = {}, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app || !templateMount || !lessonId || typeof navigate !== 'function') throw new TypeError('Learning viewer requires app, template mount, lesson id and navigation.');
  const content = documentRef.createElement('div');
  content.className = 'lesson-learning-view-page';
  const student = context.student || '';
  const goLessons = () => navigate(buildViewUrl('lessons.html', { student, mode: 'management' }));
  mountPacoPageTemplate({ mount: templateMount, backLabel: '← Lessen', backAction: goLessons, greeting: 'PAB beheer ⚙️', title: 'Leerstof bekijken', icon: '🧠', subtitle: 'De opgeslagen leerstofkaarten.', navigation: createPacoNavigation({ app, active: 'management', student, viewMode: context.mode || 'management', includeCreator: true, navigate }), content });

  async function mount() {
    await app.initializeSession();
    if (!app.auth.isParent) { showMessage(content, 'Je hebt geen toegang tot deze leerstof.', 'message error'); return; }
    const records = await app.loadLessons();
    const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId)) || null;
    if (!lesson) { showMessage(content, 'Deze les kon niet worden gevonden.', 'message error'); return; }
    const cards = await app.learningContent.listForLesson(lesson.id);
    const saved = context.saved === '1';
    content.innerHTML = `<div class="learning-view-wrap">${saved ? '<div class="message success learning-view-saved">Opgeslagen.</div>' : ''}<div class="learning-view-meta"><h2>${escapeHtml(lesson.title || 'Leerstof')}</h2><p>${escapeHtml(lesson.subject || '')}${lesson.subvak ? ` · ${escapeHtml(lesson.subvak)}` : ''}</p></div><div class="learning-view-cards">${cards.length ? cards.map((card, index) => `<article class="learning-view-card"><div class="learning-view-card-number">Kaart ${index + 1}</div>${card.title ? `<h3>${escapeHtml(card.title)}</h3>` : ''}<div class="learning-view-surface">${renderDocument(card.document)}</div></article>`).join('') : '<div class="message">Er zijn nog geen opgeslagen leerstofkaarten.</div>'}</div></div>`;
  }
  return Object.freeze({ mount });
}
