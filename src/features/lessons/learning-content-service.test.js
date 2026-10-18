import { describe, expect, it, vi } from 'vitest';
import { createLearningContentService } from './learning-content-service.js';

function createDb() {
  const rows = [
    { id: 1, lesson_id: 10, title: 'Azië', content: 'Azië is het grootste continent.', image_id: 7, sort_order: 0 },
    { id: 2, lesson_id: 10, title: 'Klimaat', content: 'Azië heeft verschillende klimaten.', image_id: null, sort_order: 1 }
  ];
  const makeQuery = () => {
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      order: vi.fn(() => query),
      delete: vi.fn(() => query),
      insert: vi.fn(() => query),
      in: vi.fn(() => query),
      then: undefined
    };
    return query;
  };
  return { rows, from: vi.fn((table) => {
    const query = makeQuery();
    query.then = async resolve => resolve({ data: table === 'lesson_learning_cards' ? rows : [], error: null });
    return query;
  }) };
}

describe('learning content service', () => {
  it('reads cards in lesson order and attaches managed media', async () => {
    const db = createDb();
    const media = { getByIds: vi.fn(async ids => [{ id: ids[0], url: '/signed/asia.jpg' }]) };
    const service = createLearningContentService(db, { media, canManage: () => true });
    const cards = await service.listForLesson(10);
    expect(cards).toHaveLength(2);
    expect(cards[0].title).toBe('Azië');
    expect(cards[0].image.url).toBe('/signed/asia.jpg');
    expect(media.getByIds).toHaveBeenCalledWith([7]);
  });

  it('rejects writes without management authorization', async () => {
    const service = createLearningContentService(createDb(), { canManage: () => false });
    await expect(service.replaceForLesson(10, [{ title: 'A', content: 'B' }]))
      .rejects.toThrow('Log eerst in als ouder.');
  });
});
