import { describe, expect, it, vi } from 'vitest';
import { createLearningContentService } from './learning-content-service.js';

function createQuery(result = { data: [], error: null }) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    upsert: vi.fn(() => query),
    delete: vi.fn(() => query),
    in: vi.fn(() => query),
    then: undefined
  };
  query.then = async resolve => resolve(result);
  return query;
}

describe('learning content service', () => {
  it('reads structured cards in lesson order and attaches managed media to image elements', async () => {
    const rows = [
      { id: 1, lesson_id: 10, title: 'Azië', document: { version: 1, elements: [{ id: 't1', type: 'text', html: '<strong>Groot</strong>' }, { id: 'i1', type: 'image', media_id: 7, width: 70 }] }, sort_order: 0 },
      { id: 2, lesson_id: 10, title: 'Klimaat', document: { version: 1, elements: [{ id: 't2', type: 'text', html: 'Klein' }] }, sort_order: 1 }
    ];
    const db = { from: vi.fn(() => createQuery({ data: rows, error: null })) };
    const media = { getByIds: vi.fn(async ids => [{ id: ids[0], url: '/signed/asia.jpg' }]) };
    const service = createLearningContentService(db, { media, canManage: () => true });
    const cards = await service.listForLesson(10);
    expect(cards).toHaveLength(2);
    expect(cards[0].document.elements[1].image.url).toBe('/signed/asia.jpg');
    expect(media.getByIds).toHaveBeenCalledWith([7]);
  });

  it('rejects writes without management authorization', async () => {
    const service = createLearningContentService({ from: vi.fn() }, { canManage: () => false });
    await expect(service.replaceForLesson(10, [{ title: 'A', document: { version: 1, elements: [] } }]))
      .rejects.toThrow('Log eerst in als ouder.');
  });

  it('preserves existing card ids while updating order and structured content', async () => {
    const existing = createQuery({ data: [{ id: 4 }, { id: 5 }], error: null });
    const save = createQuery({ data: [{ id: 4, lesson_id: 10, title: 'A', document: { version: 1, elements: [{ id: 't', type: 'text', html: 'B' }] }, sort_order: 0, created_at: null }], error: null });
    const remove = createQuery({ data: [], error: null });
    const read = createQuery({ data: [{ id: 4, lesson_id: 10, title: 'A', document: { version: 1, elements: [{ id: 't', type: 'text', html: 'B' }] }, sort_order: 0, created_at: null }], error: null });
    const db = { from: vi.fn()
      .mockReturnValueOnce(existing)
      .mockReturnValueOnce(save)
      .mockReturnValueOnce(remove)
      .mockReturnValueOnce(read) };
    const service = createLearningContentService(db, { canManage: () => true });
    await service.replaceForLesson(10, [{ id: 4, title: 'A', document: { version: 1, elements: [{ id: 't', type: 'text', html: 'B' }] } }]);
    expect(save.upsert).toHaveBeenCalledWith(
      [{ id: 4, lesson_id: 10, title: 'A', document: { version: 1, elements: [{ id: 't', type: 'text', html: 'B' }] }, sort_order: 0 }],
      { defaultToNull: false }
    );
    expect(remove.in).toHaveBeenCalledWith('id', [5]);
  });

  it('leaves new card ids to the database identity default', async () => {
    const existing = createQuery({ data: [{ id: 4 }], error: null });
    const save = createQuery({ data: [{ id: 5, lesson_id: 10, title: 'Nieuw', document: { version: 1, elements: [{ id: 't', type: 'text', html: 'B' }] }, sort_order: 1, created_at: null }], error: null });
    const remove = createQuery({ data: [], error: null });
    const read = createQuery({ data: [{ id: 4 }, { id: 5 }], error: null });
    const db = { from: vi.fn()
      .mockReturnValueOnce(existing)
      .mockReturnValueOnce(save)
      .mockReturnValueOnce(remove)
      .mockReturnValueOnce(read) };
    const service = createLearningContentService(db, { canManage: () => true });
    await service.replaceForLesson(10, [
      { id: 4, title: 'Bestaand', document: { version: 1, elements: [{ id: 'a', type: 'text', html: 'A' }] } },
      { title: 'Nieuw', document: { version: 1, elements: [{ id: 'b', type: 'text', html: 'B' }] } }
    ]);
    expect(save.upsert).toHaveBeenCalledWith([
      { id: 4, lesson_id: 10, title: 'Bestaand', document: { version: 1, elements: [{ id: 'a', type: 'text', html: 'A' }] }, sort_order: 0 },
      { lesson_id: 10, title: 'Nieuw', document: { version: 1, elements: [{ id: 'b', type: 'text', html: 'B' }] }, sort_order: 1 }
    ], { defaultToNull: false });
  });
});
