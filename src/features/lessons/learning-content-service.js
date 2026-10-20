const CARD_SELECT = 'id,lesson_id,title,document,sort_order,created_at';
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

function normalizeDocument(input) {
  const source = input && typeof input === 'object' ? input : {};
  const elements = Array.isArray(source.elements) ? source.elements : [];
  return {
    version: 1,
    elements: elements.map((element, index) => {
      const id = String(element?.id || `element-${index + 1}`);
      if (element?.type === 'image') {
        const mediaId = Number(element.media_id);
        if (!mediaId) return null;
        const width = Math.min(100, Math.max(20, Math.round(Number(element.width) || 100)));
        return { id, type: 'image', media_id: mediaId, width };
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
      ...(card.document || { version: 1, elements: [] }),
      elements: (card.document?.elements || []).map(element => element.type === 'image'
        ? { ...element, image: byId.get(Number(element.media_id)) || null }
        : element)
    }
  }));
}

export function createLearningContentService(db, { media = null, canManage = () => false } = {}) {
  if (!db) throw new Error('Supabase client ontbreekt.');

  async function listForLesson(lessonId, { includeImages = true } = {}) {
    if (!lessonId) return [];
    const result = await db.from('lesson_learning_cards')
      .select(CARD_SELECT)
      .eq('lesson_id', Number(lessonId))
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });
    if (result.error) throw result.error;
    const cards = result.data || [];
    if (!includeImages || !media) return cards;
    const imageIds = [...new Set(cards.flatMap(card => (card.document?.elements || [])
      .filter(element => element.type === 'image')
      .map(element => Number(element.media_id))
      .filter(Boolean)))];
    if (!imageIds.length) return cards;
    return attachImages(cards, await media.getByIds(imageIds));
  }

  async function replaceForLesson(lessonId, cards = []) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    if (!lessonId) throw new Error('Geen les geselecteerd.');
    const lessonKey = Number(lessonId);
    const existing = await db.from('lesson_learning_cards').select('id').eq('lesson_id', lessonKey);
    if (existing.error) throw existing.error;
    const existingIds = new Set((existing.data || []).map(row => Number(row.id)));
    const rows = (Array.isArray(cards) ? cards : [])
      .map((card, index) => ({
        ...(card?.id && existingIds.has(Number(card.id)) ? { id: Number(card.id) } : {}),
        lesson_id: lessonKey,
        title: String(card?.title ?? '').trim(),
        document: normalizeDocument(card?.document),
        sort_order: index
      }))
      .filter(card => card.title || card.document.elements.length);

    if (rows.length) {
      const saved = await db.from('lesson_learning_cards').upsert(rows, { defaultToNull: false }).select(CARD_SELECT);
      if (saved.error) throw saved.error;
    }

    const keptIds = new Set(rows.map(row => Number(row.id)).filter(Boolean));
    const removedIds = [...existingIds].filter(id => !keptIds.has(id));
    if (removedIds.length) {
      const removed = await db.from('lesson_learning_cards').delete().in('id', removedIds).eq('lesson_id', lessonKey);
      if (removed.error) throw removed.error;
    }
    return listForLesson(lessonKey);
  }

  async function uploadCardImage(lessonId, file) {
    if (!media) throw new Error('Lesmedia-service ontbreekt.');
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    return media.uploadForLesson(lessonId, file);
  }

  async function removeCardImage(imageId) {
    if (!media || !imageId) return false;
    return media.remove(imageId);
  }

  return Object.freeze({ listForLesson, replaceForLesson, uploadCardImage, removeCardImage, normalizeHtml, normalizeDocument });
}
