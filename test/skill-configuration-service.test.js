import { describe, expect, it, vi } from 'vitest';
import { createSkillConfigurationService } from '../src/services/skill-configuration-service.js';

function createDb() {
  const query = {
    filters: [],
    eq: vi.fn((field, value) => { query.filters.push([field, value]); return query; }),
    order: vi.fn(() => query),
    upsert: vi.fn(payload => { query.payload = payload; return query; }),
    select: vi.fn(() => query)
  };
  query.then = undefined;
  query.upsertResult = { data: [{ id: 101, student: 'Zephon', skill_id: 'math-test', enabled: true, settings: {}, updated_at: '2026-10-25T00:00:00Z', created_at: '2026-10-25T00:00:00Z' }], error: null };
  query.single = undefined;
  query[Symbol.asyncIterator] = undefined;
  query.select.mockImplementation(() => query);
  query.upsert.mockImplementation(payload => {
    query.payload = payload;
    return { ...query, then: (resolve) => resolve(query.upsertResult) };
  });
  return { from: vi.fn(() => query), query };
}

describe('skill-configuration-service', () => {
  it('persists a newly created Skill as enabled for the selected learner', async () => {
    const { from, query } = createDb();
    const service = createSkillConfigurationService({ from }, { canConfigure: () => true });

    const saved = await service.saveForStudent('Zephon', [{ skillId: 'math-test', enabled: true }]);

    expect(query.payload).toEqual([
      expect.objectContaining({ student: 'Zephon', skill_id: 'math-test', enabled: true, settings: {} })
    ]);
    expect(saved[0]).toEqual(expect.objectContaining({ student: 'Zephon', skillId: 'math-test', enabled: true }));
  });
});
