import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';

function escapeHtml(value) { return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
function renderDocument(model) { return (Array.isArray(model?.elements) ? model.elements : []).map(element => element?.type === 'image' && element.media_id && element.image?.url ? `<img class="learning-view-image" src="${escapeHtml(element.image.url)}" alt="${escapeHtml(element.image.original_name || 'Afbeelding')}" style="width:${Math.min(100, Math.max(20, Number(element.width) || 100))}%">` : element?.type === 'text' ? element.html || '' : '').join(''); }
function showMessage(content, message, className = 'message') { content.innerHTML = `<div class="${className}">${escapeHtml(message)}</div>`; }

export function createLessonLearningViewRuntime({ app, templateMount, context = {}, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app || !templateMount || !lessonId || typeof navigate !== 'function') throw new TypeError('Learning viewer requires app, template mount, lesson context and navigation.');
  const content = documentRef.createElement('div'); content.className = 'lesson-learning-view-page'; const student = context.student || '';
  const goLessons = () => navigate(buildViewUrl('lessons.html', { student, mode: context.mode || 'management' }));
  mountPacoPageTemplate({ mount: templateMount, backLabel: '← Vakken', backAction: goLessons, greeting: 'PAB beheer ⚙️', title: 'Leerstof bekijken', icon: '🧠', subtitle: 'Leerstof die bij het vak en onderwerp hoort.', navigation: createPacoNavigation({ app, active: 'management', student, viewMode: context.mode || 'management', includeCreator: true, navigate }), content });
  async function mount() {
    await app.initializeSession(); if (!app.auth.isParent) { showMessage(content, 'Je hebt geen toegang tot deze leerstof.', 'message error'); return; }
    const records = await app.loadLessons(); const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId)) || null;
    if (!lesson?.learning_topic_id) { showMessage(content, 'Deze les is nog niet gekoppeld aan een leerstofonderwerp.', 'message error'); return; }
    const cards = await app.learningContent.listForTopic(lesson.learning_topic_id); const saved = context.saved === '1'; let current = 0;
    const render = () => { const card = cards[current]; content.innerHTML = `<div class="learning-view-wrap">${saved ? '<div class="message success learning-view-saved">Opgeslagen.</div>' : ''}<div class="learning-view-meta"><h2>${escapeHtml(lesson.subject || '')}${lesson.subvak ? ` · ${escapeHtml(lesson.subvak)}` : ''}</h2><p>${cards.length ? `Kaart ${current + 1} van ${cards.length}` : 'Nog geen leerstofkaarten.'}</p></div>${card ? `<article class="learning-view-card"><div class="learning-view-card-number">Kaart ${current + 1}</div>${card.title ? `<h3>${escapeHtml(card.title)}</h3>` : ''}<div class="learning-view-surface">${renderDocument(card.document)}</div></article><div class="learning-view-navigation"><button type="button" data-prev ${current === 0 ? 'disabled' : ''}>← Vorige</button><span>${current + 1} / ${cards.length}</span><button type="button" data-next ${current === cards.length - 1 ? 'disabled' : ''}>Volgende →</button></div>` : '<div class="message">Er zijn nog geen opgeslagen leerstofkaarten.</div>'}</div>`; content.querySelector('[data-prev]')?.addEventListener('click', () => { current -= 1; render(); }); content.querySelector('[data-next]')?.addEventListener('click', () => { current += 1; render(); }); };
    render();
  }
  return Object.freeze({ mount });
}
