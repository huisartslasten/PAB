import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createLearningContentService } from './learning-content-service.js';
import * as imagePlacement from '../core/image-placement.js';

function query(result = { data: [], error: null }, t) {
  const q = {
    select: t.mock.fn(() => q),
    eq: t.mock.fn(() => q),
    order: t.mock.fn(() => q),
    upsert: t.mock.fn(() => q),
    delete: t.mock.fn(() => q),
    in: t.mock.fn(() => q)
  };
  q.then = async resolve => resolve(result);
  return q;
}

const withPlacement = options => ({ imagePlacement, ...options });

describe('learning content service', () => {
  it('reads topic-owned structured cards and normalizes wrapped images to a text-flow side', async t => {
    const rows = [{ id: 1, learning_topic_id: 10, title: 'Azië', document: { version: 3, elements: [{ id: 'i1', type: 'image', media_id: 7, size: { width: 70, unit: 'percent' }, placement: { mode: 'flow', x: 18, y: 42, wrap: 'square' } }] }, sort_order: 0 }];
    const db = { from: t.mock.fn(() => query({ data: rows, error: null }, t)) };
    const media = { getByIds: t.mock.fn(async ids => [{ id: ids[0], url: '/signed/asia.jpg' }]) };
    const topics = { getById: t.mock.fn(async id => ({ id, student: 'Zyon', subject: 'Nederlands', subvak: 'Boekbespreking' })) };
    const service = createLearningContentService(db, withPlacement({ media, topics, canManage: () => true }));
    const cards = await service.listForTopic(10);

    assert.equal(cards[0].document.version, 3);
    assert.deepStrictEqual(cards[0].document.elements[0].size, { width: 70, unit: 'percent' });
    assert.deepStrictEqual(cards[0].document.elements[0].placement, { mode: 'flow', x: 30, y: 0, wrap: 'square' });
    assert.equal(cards[0].document.elements[0].image.url, '/signed/asia.jpg');
    assert.deepStrictEqual(media.getByIds.mock.calls.map(call => call.arguments), [[[7]]]);
  });

  it('migrates the previous side/offset layout into the canonical wrapped-position model', async t => {
    const rows = [{ id: 2, learning_topic_id: 10, title: 'Migratie', document: { version: 2, elements: [{ id: 'i2', type: 'image', media_id: 8, width: 60, placement: { side: 'right', offset: 10 } }] }, sort_order: 0 }];
    const db = { from: t.mock.fn(() => query({ data: rows, error: null }, t)) };
    const service = createLearningContentService(db, withPlacement({ topics: { getById: t.mock.fn(async id => ({ id })) } }));
    const cards = await service.listForTopic(10, { includeImages: false });

    assert.equal(cards[0].document.version, 3);
    assert.deepStrictEqual(cards[0].document.elements[0].size, { width: 60, unit: 'percent' });
    assert.deepStrictEqual(cards[0].document.elements[0].placement, { mode: 'flow', x: 40, y: 0, wrap: 'square' });
  });

  it('clamps extensible image layout values to the document bounds and removes vertical offsets from wrapped images', async t => {
    const rows = [{ id: 3, learning_topic_id: 10, title: 'Grenzen', document: { version: 3, elements: [{ id: 'i3', type: 'image', media_id: 9, size: { width: 95, unit: 'percent' }, placement: { mode: 'other', x: 50, y: 99999, wrap: 'circle' } }] }, sort_order: 0 }];
    const db = { from: t.mock.fn(() => query({ data: rows, error: null }, t)) };
    const service = createLearningContentService(db, withPlacement({ topics: { getById: t.mock.fn(async id => ({ id })) } }));
    const cards = await service.listForTopic(10, { includeImages: false });

    assert.deepStrictEqual(cards[0].document.elements[0].placement, { mode: 'flow', x: 5, y: 0, wrap: 'square' });
  });

  it('rejects writes without management authorization', async t => {
    const service = createLearningContentService({ from: t.mock.fn() }, withPlacement({ topics: {}, canManage: () => false }));
    await assert.rejects(service.replaceForTopic(10, []), /Log eerst in als ouder\./);
  });

  it('preserves existing ids and removes deleted cards', async t => {
    const existing = query({ data: [{ id: 4 }, { id: 5 }], error: null }, t);
    const save = query({ data: [{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 3, elements: [] }, sort_order: 0 }], error: null }, t);
    const remove = query({ data: [], error: null }, t);
    const read = query({ data: [{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 3, elements: [] }, sort_order: 0 }], error: null }, t);
    const from = t.mock.fn();
    from.mock.mockImplementationOnce(() => existing);
    from.mock.mockImplementationOnce(() => save);
    from.mock.mockImplementationOnce(() => remove);
    from.mock.mockImplementationOnce(() => read);
    const db = { from };
    const topics = { getById: t.mock.fn(async id => ({ id })) };
    const service = createLearningContentService(db, withPlacement({ topics, canManage: () => true }));

    await service.replaceForTopic(10, [{ id: 4, title: 'A', document: { version: 3, elements: [] } }]);

    assert.deepStrictEqual(save.upsert.mock.calls[0].arguments, [[{ id: 4, learning_topic_id: 10, title: 'A', document: { version: 3, elements: [] }, sort_order: 0 }], { defaultToNull: false }]);
    assert.deepStrictEqual(remove.in.mock.calls[0].arguments, ['id', [5]]);
  });
});
