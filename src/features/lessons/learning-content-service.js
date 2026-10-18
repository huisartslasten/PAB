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
    const rows = (Array.isArray(cards) ? cards : [])
      .map((card, index) => ({
        lesson_id: Number(lessonId),
        title: String(card?.title ?? '').trim(),
        content: normalizeHtml(card?.content ?? ''),
        image_id: card?.image_id ? Number(card.image_id) : null,
        sort_order: index
      }))
      .filter(card => card.title || card.content || card.image_id != null);

    const existing = await db.from('lesson_learning_cards')
      .select('id,image_id')
      .eq('lesson_id', Number(lessonId));
    if (existing.error) throw existing.error;

    const removed = await db.from('lesson_learning_cards').delete().eq('lesson_id', Number(lessonId));
    if (removed.error) throw removed.error;
    if (!rows.length) return [];

    const inserted = await db.from('lesson_learning_cards').insert(rows).select(CARD_SELECT);
    if (inserted.error) throw inserted.error;
    return inserted.data || [];
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
