const CARD_SELECT = 'id,lesson_id,title,content,image_id,sort_order,created_at';

function normalizeHtml(value) {
  const source = String(value ?? '');
  if (typeof DOMParser === 'undefined') return source.trim();
  const doc = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  const allowed = new Set(['B', 'STRONG', 'I', 'EM', 'SPAN', 'P', 'BR', 'UL', 'OL', 'LI']);
  root.querySelectorAll('*').forEach(node => {
    if (!allowed.has(node.tagName)) {
      node.replaceWith(...node.childNodes);
      return;
    }
    [...node.attributes].forEach(attribute => {
      if (node.tagName === 'SPAN' && attribute.name === 'class' && /^learning-size-(large|small)$/.test(attribute.value)) return;
      node.removeAttribute(attribute.name);
    });
  });
  return root.innerHTML.trim();
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
    if (!includeImages || !cards.some(card => card.image_id) || !media) return cards;
    const imageIds = [...new Set(cards.map(card => Number(card.image_id)).filter(Boolean))];
    const images = await media.getByIds(imageIds);
    const byId = new Map(images.map(image => [Number(image.id), image]));
    return cards.map(card => ({ ...card, image: card.image_id ? byId.get(Number(card.image_id)) || null : null }));
  }

  async function replaceForLesson(lessonId, cards = []) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    if (!lessonId) throw new Error('Geen les geselecteerd.');
    const lessonKey = Number(lessonId);
    const existing = await db.from('lesson_learning_cards')
      .select('id')
      .eq('lesson_id', lessonKey);
    if (existing.error) throw existing.error;
    const existingIds = new Set((existing.data || []).map(row => Number(row.id)));

    const rows = (Array.isArray(cards) ? cards : [])
      .map((card, index) => ({
        ...(card?.id && existingIds.has(Number(card.id)) ? { id: Number(card.id) } : {}),
        lesson_id: lessonKey,
        title: String(card?.title ?? '').trim(),
        content: normalizeHtml(card?.content ?? ''),
        image_id: card?.image_id ? Number(card.image_id) : null,
        sort_order: index
      }))
      .filter(card => card.title || card.content || card.image_id != null);

    if (rows.length) {
      const saved = await db.from('lesson_learning_cards').upsert(rows).select(CARD_SELECT);
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

  return Object.freeze({ listForLesson, replaceForLesson, uploadCardImage, removeCardImage, normalizeHtml });
}
