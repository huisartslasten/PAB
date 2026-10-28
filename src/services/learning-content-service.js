const CARD_SELECT = 'id,learning_topic_id,title,document,sort_order,created_at';
const DOCUMENT_VERSION = 3;
const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'SPAN', 'P', 'BR', 'UL', 'OL', 'LI', 'DIV']);
const ALLOWED_SPAN_CLASSES = /^(learning-inline-size)$/;

function normalizeHtml(value) {
  const source = String(value ?? '');
  if (typeof DOMParser === 'undefined') return source.trim();
  const doc = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  root.querySelectorAll('*').forEach(node => {
    if (!ALLOWED_TAGS.has(node.tagName)) {
      node.replaceWith(...node.childNodes);
      return;
    }
    [...node.attributes].forEach(attribute => {
      if (node.tagName !== 'SPAN') {
        node.removeAttribute(attribute.name);
        return;
      }
      if (attribute.name === 'class' && ALLOWED_SPAN_CLASSES.test(attribute.value)) return;
      if (attribute.name === 'style') {
        const fontSize = String(node.style.fontSize || '').trim();
        const numeric = Number.parseInt(fontSize, 10);
        if (/^\d{1,2}px$/.test(fontSize) && numeric >= 12 && numeric <= 48) {
          node.setAttribute('style', `font-size:${numeric}px`);
          return;
        }
      }
      node.removeAttribute(attribute.name);
    });
  });
  return root.innerHTML.trim();
}

export function createLearningContentService(db, { media = null, canManage = () => false, topics = null, imagePlacement = null } = {}) {
  if (!db) throw new Error('Supabase client ontbreekt.');
  if (!topics) throw new Error('Learning topic service ontbreekt.');
  if (!imagePlacement?.clampImageWidth || !imagePlacement?.migrateLegacyPlacement || !imagePlacement?.normalizeImagePlacement) {
    throw new Error('Learning image placement owner ontbreekt.');
  }
  const { clampImageWidth, migrateLegacyPlacement, normalizeImagePlacement } = imagePlacement;

  function normalizeDocument(input) {
    const source = input && typeof input === 'object' ? input : {};
    const elements = Array.isArray(source.elements) ? source.elements : [];
    return {
      version: DOCUMENT_VERSION,
      elements: elements.map((element, index) => {
        const id = String(element?.id || `element-${index + 1}`);
        if (element?.type === 'image') {
          const mediaId = Number(element.media_id);
          if (!mediaId) return null;
          const width = clampImageWidth(element.size?.width ?? element.width);
          const placement = source.version >= DOCUMENT_VERSION
            ? normalizeImagePlacement(element.placement, width)
            : migrateLegacyPlacement(element.placement, width);
          return {
            id,
            type: 'image',
            media_id: mediaId,
            size: { width, unit: 'percent' },
            placement
          };
        }
        if (element?.type === 'text') {
          const html = normalizeHtml(element.html || '');
          return html ? { id, type: 'text', html } : null;
        }
        return null;
      }).filter(Boolean)
    };
  }

  function attachImages(cards, images) {
    const byId = new Map(images.map(image => [Number(image.id), image]));
    return cards.map(card => ({
      ...card,
      document: {
        ...(card.document || { version: DOCUMENT_VERSION, elements: [] }),
        elements: (card.document?.elements || []).map(element => element.type === 'image'
          ? { ...element, image: byId.get(Number(element.media_id)) || null }
          : element)
      }
    }));
  }

  async function resolveTopic(topicOrContext) {
    if (typeof topicOrContext === 'object' && topicOrContext?.id) return topics.getById(topicOrContext.id);
    if (topicOrContext?.student && topicOrContext?.subject) return topics.ensureTopic(topicOrContext);
    return topics.getById(topicOrContext);
  }

  async function listForTopic(topicId, { includeImages = true } = {}) {
    if (!topicId) return [];
    const result = await db.from('learning_material_cards').select(CARD_SELECT).eq('learning_topic_id', Number(topicId)).order('sort_order', { ascending: true }).order('id', { ascending: true });
    if (result.error) throw result.error;
    const cards = (result.data || []).map(card => ({ ...card, document: normalizeDocument(card.document) }));
    if (!includeImages || !media) return cards;
    const imageIds = [...new Set(cards.flatMap(card => (card.document?.elements || []).filter(element => element.type === 'image').map(element => Number(element.media_id)).filter(Boolean)))];
    return imageIds.length ? attachImages(cards, await media.getByIds(imageIds)) : cards;
  }

  async function replaceForTopic(topicOrContext, cards = []) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const topic = await resolveTopic(topicOrContext);
    if (!topic?.id) throw new Error('Geen leerstofonderwerp geselecteerd.');
    const topicKey = Number(topic.id);
    const existing = await db.from('learning_material_cards').select('id').eq('learning_topic_id', topicKey);
    if (existing.error) throw existing.error;
    const existingIds = new Set((existing.data || []).map(row => Number(row.id)));
    const rows = (Array.isArray(cards) ? cards : []).map((card, index) => ({
      ...(card?.id && existingIds.has(Number(card.id)) ? { id: Number(card.id) } : {}),
      learning_topic_id: topicKey,
      title: String(card?.title ?? '').trim(),
      document: normalizeDocument(card?.document),
      sort_order: index
    })).filter(card => card.title || card.document.elements.length);
    if (rows.length) {
      const saved = await db.from('learning_material_cards').upsert(rows, { defaultToNull: false }).select(CARD_SELECT);
      if (saved.error) throw saved.error;
    }
    const keptIds = new Set(rows.map(row => Number(row.id)).filter(Boolean));
    const removedIds = [...existingIds].filter(id => !keptIds.has(id));
    if (removedIds.length) {
      const removed = await db.from('learning_material_cards').delete().in('id', removedIds).eq('learning_topic_id', topicKey);
      if (removed.error) throw removed.error;
    }
    return listForTopic(topicKey);
  }

  async function uploadCardImage(topicId, file) {
    if (!media) throw new Error('Leerstofmedia-service ontbreekt.');
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    return media.uploadForTopic(topicId, file);
  }

  async function removeCardImage(imageId) {
    if (!media || !imageId) return false;
    return media.remove(imageId);
  }

  return Object.freeze({ resolveTopic, listForTopic, replaceForTopic, uploadCardImage, removeCardImage, normalizeHtml, normalizeDocument });
}
