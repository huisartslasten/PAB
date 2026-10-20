import { describe, expect, it, vi } from 'vitest';
import { createLearningContentService } from './learning-content-service.js';

function query(result = { data: [], error: null }) { const q = { select: vi.fn(() => q), eq: vi.fn(() => q), order: vi.fn(() => q), upsert: vi.fn(() => q), delete: vi.fn(() => q), in: vi.fn(() => q) }; q.then = async resolve => resolve(result); return q; }

describe('learning content service', () => {
  it('reads topic-owned structured cards and attaches media', async () => {
    const rows = [{ id: 1, learning_topic_id: 10, title: 'Azië', document: { version: 1, elements: [{ id: 'i1', type: 'image', media_id: 7, width: 70 }] }, sort_order: 0 }];
    const db = { from: vi.fn(() => query({ data: rows, error: null })) };
    const media = { getByIds: vi.fn(async ids => [{ id: ids[0], url: '/signed/asia.jpg' }]) };
    const topics = { getById: vi.fn(async id => ({ id, student: 'Zyon', subject: 'Nederlands', subvak: 'Boekbespreking' })) };
    const service = createLearningContentService(db, { media, topics, canManage: () => true });
    const cards = await service.listForTopic(10);
    expect(cards[0].document.elements[0].image.url).toBe('/signed/asia.jpg');
    expect(media.getByIds).toHaveBeenCalledWith([7]);
  });

  it('rejects writes without management authorization', async () => {
    const service = createLearningContentService({ from: vi.fn() }, { topics: {}, canManage: () => false });
    await expect(service.replaceForTopic(10, [])).rejects.toThrow('Log eerst in als ouder.');
  });

  it('preserves existing ids and removes deleted cards', async () => {
    const existing = query({ data: [{ id: 4 }, { id: 5 }], error: null });
    const save = query({ data: [{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 1, elements: [] }, sort_order: 0 }], error: null });
    const remove = query({ data: [], error: null });
    const read = query({ data: [{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 1, elements: [] }, sort_order: 0 }], error: null });
    const db = { from: vi.fn().mockReturnValueOnce(existing).mockReturnValueOnce(save).mockReturnValueOnce(remove).mockReturnValueOnce(read) };
    const topics = { getById: vi.fn(async id => ({ id })) };
    const service = createLearningContentService(db, { topics, canManage: () => true });
    await service.replaceForTopic(10, [{ id: 4, title: 'A', document: { version: 1, elements: [] } }]);
    expect(save.upsert).toHaveBeenCalledWith([{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 1, elements: [] }, sort_order: 0 }], { defaultToNull: false });
    expect(remove.in).toHaveBeenCalledWith('id', [5]);
  });
});
