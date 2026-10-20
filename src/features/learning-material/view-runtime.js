import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function clampWidth(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(20, Math.round(n))) : 100;
}

function clampX(value, width) {
  const safeWidth = clampWidth(width);
  const max = Math.max(0, 100 - safeWidth);
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(0, Math.round(n))) : Math.round(max / 2);
}

function clampY(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(10000, Math.max(-10000, Math.round(n))) : 0;
}

function normalizePlacement(value, width) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    mode: 'flow',
    x: clampX(source.x, width),
    y: clampY(source.y),
    wrap: source.wrap === 'none' ? 'none' : 'square'
  };
}

function imageStyle(placement, width) {
  const safeWidth = clampWidth(width);
  const normalized = normalizePlacement(placement, safeWidth);
  if (normalized.wrap === 'none') {
    return `width:${safeWidth}%;margin-left:${normalized.x}%;margin-top:${normalized.y}px;`;
  }
  return `width:${safeWidth}%;margin-left:${normalized.x}%;margin-top:${normalized.y}px;`;
}

function renderDocument(model) {
  return (Array.isArray(model?.elements) ? model.elements : []).map(element => {
    if (element?.type === 'image' && element.media_id && element.image?.url) {
      const width = clampWidth(element.size?.width ?? element.width);
      const placement = normalizePlacement(element.placement, width);
      return `<img class="learning-view-image learning-view-image-${placement.wrap}" src="${escapeHtml(element.image.url)}" alt="${escapeHtml(element.image.original_name || 'Afbeelding')}" style="${imageStyle(placement, width)}">`;
    }
    return element?.type === 'text' ? element.html || '' : '';
  }).join('');
}

function showMessage(content, message, className = 'message') {
  content.innerHTML = `<div class="${className}">${escapeHtml(message)}</div>`;
}

export function createLearningMaterialViewRuntime({ app, templateMount, context = {}, topicId = '', documentRef = document, navigate } = {}) {
  if (!app || !templateMount || typeof navigate !== 'function' || !topicId) {
    throw new TypeError('Learning material viewer requires app, template mount, topic and navigation.');
  }
  const content = documentRef.createElement('div');
  content.className = 'lesson-learning-view-page';
  const student = context.student || '';
  const goBack = () => navigate(buildViewUrl('lessons.html', { student, mode: context.mode || 'management', subject: context.subject || '' }));
  mountPacoPageTemplate({
    mount: templateMount,
    backLabel: '← Vakken',
    backAction: goBack,
    greeting: 'PAB beheer ⚙️',
    title: 'Leerstof',
    icon: '🧠',
    subtitle: 'Leerstofkaarten van dit vak en onderwerp.',
    navigation: createPacoNavigation({ app, active: 'management', student, viewMode: context.mode || 'management', includeCreator: true, navigate }),
    content
  });

  async function mount() {
    await app.initializeSession();
    const topic = await app.learningTopics.getById(topicId);
    if (!topic) {
      showMessage(content, 'Dit leerstofonderwerp kon niet worden gevonden.', 'message error');
      return;
    }
    const cards = await app.learningContent.listForTopic(topic.id);
    let current = 0;
    const render = () => {
      const card = cards[current];
      content.innerHTML = `<div class="learning-view-wrap">${context.saved === '1' ? '<div class="message success learning-view-saved">Opgeslagen.</div>' : ''}<div class="learning-view-meta"><h2>${escapeHtml(topic.subject)}</h2><p>${escapeHtml(topic.subvak)}${cards.length ? ` · ${current + 1} / ${cards.length}` : ''}</p></div>${card ? `<article class="learning-view-card"><div class="learning-view-card-number">Kaart ${current + 1}</div>${card.title ? `<h3>${escapeHtml(card.title)}</h3>` : ''}<div class="learning-view-surface">${renderDocument(card.document)}</div></article><div class="learning-view-navigation"><button type="button" data-prev ${current === 0 ? 'disabled' : ''}>← Vorige</button><span>${current + 1} / ${cards.length}</span><button type="button" data-next ${current === cards.length - 1 ? 'disabled' : ''}>Volgende →</button></div>` : '<div class="message">Er zijn nog geen opgeslagen leerstofkaarten.</div>'}</div>`;
      content.querySelector('[data-prev]')?.addEventListener('click', () => { current -= 1; render(); });
      content.querySelector('[data-next]')?.addEventListener('click', () => { current += 1; render(); });
    };
    render();
  }

  return Object.freeze({ mount });
}
