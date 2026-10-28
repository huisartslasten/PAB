import { describe, expect, it, vi } from 'vitest';
import { createLearningContentService } from './learning-content-service.js';
import * as imagePlacement from '../core/image-placement.js';

function query(result = { data: [], error: null }) { const q = { select: vi.fn(() => q), eq: vi.fn(() => q), order: vi.fn(() => q), upsert: vi.fn(() => q), delete: vi.fn(() => q), in: vi.fn(() => q) }; q.then = async resolve => resolve(result); return q; }
const withPlacement = options => ({ imagePlacement, ...options });

describe('learning content service', () => {
  it('reads topic-owned structured cards and normalizes wrapped images to a text-flow side', async () => {
    const rows = [{ id: 1, learning_topic_id: 10, title: 'Azië', document: { version: 3, elements: [{ id: 'i1', type: 'image', media_id: 7, size: { width: 70, unit: 'percent' }, placement: { mode: 'flow', x: 18, y: 42, wrap: 'square' } }] }, sort_order: 0 }];
    const db = { from: vi.fn(() => query({ data: rows, error: null })) };
    const media = { getByIds: vi.fn(async ids => [{ id: ids[0], url: '/signed/asia.jpg' }]) };
    const topics = { getById: vi.fn(async id => ({ id, student: 'Zyon', subject: 'Nederlands', subvak: 'Boekbespreking' })) };
    const service = createLearningContentService(db, withPlacement({ media, topics, canManage: () => true }));
    const cards = await service.listForTopic(10);
    expect(cards[0].document.version).toBe(3);
    expect(cards[0].document.elements[0].size).toEqual({ width: 70, unit: 'percent' });
    expect(cards[0].document.elements[0].placement).toEqual({ mode: 'flow', x: 30, y: 0, wrap: 'square' });
    expect(cards[0].document.elements[0].image.url).toBe('/signed/asia.jpg');
    expect(media.getByIds).toHaveBeenCalledWith([7]);
  });

  it('migrates the previous side/offset layout into the canonical wrapped-position model', async () => {
    const rows = [{ id: 2, learning_topic_id: 10, title: 'Migratie', document: { version: 2, elements: [{ id: 'i2', type: 'image', media_id: 8, width: 60, placement: { side: 'right', offset: 10 } }] }, sort_order: 0 }];
    const db = { from: vi.fn(() => query({ data: rows, error: null })) };
    const service = createLearningContentService(db, withPlacement({ topics: { getById: vi.fn(async id => ({ id })) } }));
    const cards = await service.listForTopic(10, { includeImages: false });
    expect(cards[0].document.version).toBe(3);
    expect(cards[0].document.elements[0].size).toEqual({ width: 60, unit: 'percent' });
    expect(cards[0].document.elements[0].placement).toEqual({ mode: 'flow', x: 40, y: 0, wrap: 'square' });
  });

  it('clamps extensible image layout values to the document bounds and removes vertical offsets from wrapped images', async () => {
    const rows = [{ id: 3, learning_topic_id: 10, title: 'Grenzen', document: { version: 3, elements: [{ id: 'i3', type: 'image', media_id: 9, size: { width: 95, unit: 'percent' }, placement: { mode: 'other', x: 50, y: 99999, wrap: 'circle' } }] }, sort_order: 0 }];
    const db = { from: vi.fn(() => query({ data: rows, error: null })) };
    const service = createLearningContentService(db, withPlacement({ topics: { getById: vi.fn(async id => ({ id })) } }));
    const cards = await service.listForTopic(10, { includeImages: false });
    expect(cards[0].document.elements[0].placement).toEqual({ mode: 'flow', x: 5, y: 0, wrap: 'square' });
  });

  it('rejects writes without management authorization', async () => {
    const service = createLearningContentService({ from: vi.fn() }, withPlacement({ topics: {}, canManage: () => false }));
    await expect(service.replaceForTopic(10, [])).rejects.toThrow('Log eerst in als ouder.');
  });

  it('preserves existing ids and removes deleted cards', async () => {
    const existing = query({ data: [{ id: 4 }, { id: 5 }], error: null });
    const save = query({ data: [{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 3, elements: [] }, sort_order: 0 }], error: null });
    const remove = query({ data: [], error: null });
    const read = query({ data: [{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 3, elements: [] }, sort_order: 0 }], error: null });
    const db = { from: vi.fn().mockReturnValueOnce(existing).mockReturnValueOnce(save).mockReturnValueOnce(remove).mockReturnValueOnce(read) };
    const topics = { getById: vi.fn(async id => ({ id })) };
    const service = createLearningContentService(db, withPlacement({ topics, canManage: () => true }));
    await service.replaceForTopic(10, [{ id: 4, title: 'A', document: { version: 3, elements: [] } }]);
    expect(save.upsert).toHaveBeenCalledWith([{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 3, elements: [] }, sort_order: 0 }], { defaultToNull: false });
    expect(remove.in).toHaveBeenCalledWith('id', [5]);
  });
});
