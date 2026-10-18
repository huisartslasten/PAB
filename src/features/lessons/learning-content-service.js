// Canonical data/service owner for lesson learning material.
// Learning cards own text/order; lesson media remains owned by the shared lesson photo/media service.

export function createLearningContentService(db, { media = null, canManage = () => false } = {}) {
  if (!db) throw new Error('Supabase client ontbreekt.');

  async function listForLesson(lessonId, { includeImages = true } = {}) {
    if (!lessonId) return [];
    const result = await db.from('lesson_learning_cards')
      .select('id,lesson_id,title,content,image_id,sort_order,created_at')
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
    const removed = await db.from('lesson_learning_cards').delete().eq('lesson_id', Number(lessonId));
    if (removed.error) throw removed.error;
    const rows = (Array.isArray(cards) ? cards : [])
      .map((card, index) => ({
        lesson_id: Number(lessonId),
        title: String(card?.title ?? '').trim(),
        content: String(card?.content ?? '').trim(),
        image_id: card?.image_id ? Number(card.image_id) : null,
        sort_order: Number(card?.sort_order ?? index)
      }))
      .filter(card => card.title || card.content || card.image_id != null);
    if (!rows.length) return [];
    const inserted = await db.from('lesson_learning_cards').insert(rows).select('id,lesson_id,title,content,image_id,sort_order,created_at');
    if (inserted.error) throw inserted.error;
    return inserted.data || [];
  }

  async function saveCardImage(lessonId, file) {
    if (!media) throw new Error('Lesmedia-service ontbreekt.');
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    return media.uploadForLesson(lessonId, file);
  }

  async function removeCardImage(imageId) {
    if (!media || !imageId) return false;
    return media.remove(imageId);
  }

  return Object.freeze({ listForLesson, replaceForLesson, saveCardImage, removeCardImage });
}
